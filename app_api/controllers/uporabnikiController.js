const mongoose = require("mongoose");
const pomozneFunkcije = require('../pomozneFunkcije');
const Uporabnik = mongoose.model("Uporabnik");
const passport = require('passport');
const { json } = require("body-parser");
const e = require("express");

const prikazi = (req, res) => {
    
    Uporabnik 
    .find()
    .exec((napaka,uporabniki)=>{
        if(napaka){
            res.status(500).json(napaka);
        }else{
            res.status(200).json(
                uporabniki.map(uporabnik => {
                    return{
                        "_id":uporabnik._id,
                        "uporabniskoIme": uporabnik.uporabniskoIme,
                        "ePosta":uporabnik.ePosta,
                        "jeAdmin": uporabnik.jeAdmin,
                        "posta":uporabnik.posta,
                        "kraj":uporabnik.kraj
                    };
                })
            );
        }
  });
  };
const registrirajUporabnika = (req, res) => { //ok
    
//#region  ERROR HANDLING PRI KREIRANJU NOVEGA UPORABNIKA
    if( !req.body.uporabniskoIme || !req.body.ePosta || !req.body.novoGeslo || !req.body.ponoviNovoGeslo ||
        !req.body.naslov || !req.body.posta || !req.body.kraj){
            return res.status(400).json({
                    "sporočilo":"Vsi podatki v obrazcu morajo biti izpolnjeni!"
            });
        }
    if(!new RegExp(/^\d{4}$/).test(req.body.posta)){
        return res.status(400).json({
            "sporočilo": "Pošta je štirimestna številka!"
        }) 
    }
    if(!new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(req.body.ePosta)){
        return res.status(400).json({
            "sporočilo": " Uporabi svoj študentski email, ki si ga prejel od UL!"
        });
    }
    if(!(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(req.body.novoGeslo)) || req.body.novoGeslo != req.body.ponoviNovoGeslo){
        return res.status(400).json({
            "sporočilo": "Geslo mora ustrezati naslednjim kriterijem: Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!"
        }) 
    }  
    var naslov = req.body.naslov; var kraj = req.body.kraj; var uporabniskoIme = req.body.uporabniskoIme;
    if(new RegExp(/<\/?[a-z][\s\S]*>/i).test(naslov) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(kraj) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(uporabniskoIme)){
    return res.status(400).json({
            "sporočilo": "Hm, vnos ne zgleda legit."
        }) 
    }
//#endregion
    const uporabnik = new Uporabnik();
    uporabnik.uporabniskoIme = req.body.uporabniskoIme;
    uporabnik.ePosta = req.body.ePosta;
    uporabnik.nastaviGeslo(req.body.novoGeslo);
    
    uporabnik.naslov = req.body.naslov;
    uporabnik.kraj  = req.body.kraj;
    uporabnik.posta = req.body.posta;  
    
    uporabnik.nastaviZeton(pomozneFunkcije.generirajObnovitveniZeton());

    uporabnik.save(napaka => {
         if(napaka)
         {
            if(napaka.code == 11000){
                
                return res.status(409).json({
                    "sporočilo":"Uporabnik s tem emailom že ostaja v bazi, če ni si ti, sporoči staffu."
                });
            }
            else{
                return res.status(500).json({
                    "sporočilo":"Nekaj je šlo narobe."
                });
            }
         }          
        else{
           return res.status(201).json({"žeton": uporabnik.generirajJwt()});
        }
    });   
};
const pridobiPrijavnePodatkeUporabnika  = (req,res) =>{ //ok
    console.log(req.body);
    if(!req.body.ePosta || !req.body.geslo || new RegExp(/<\/?[a-z][\s\S]*>/i).test(req.body.ePosta) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(req.body)){
       return res.status(400).json({
            "sporocilo": "Vsaj en parameter (epošta ali geslo) manjka. Podana moreta biti oba parametra brez HTML značk!"
        });
    }
    if(!new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(req.body.ePosta)){
        return res.status(400).json({
            "sporočilo": " Uporabi svoj študentski email, ki si ga prejel od UL!"
        });
    }
    passport.authenticate('local',(napaka, uporabnik, informacije) =>{
        if(napaka){
            return res.status(500).json(napaka)
        }
        if(uporabnik){
            res.status(200).json({"žeton": uporabnik.generirajJwt()});
        }else{
            res.status(401).json({"sporočilo": "Kombinacija e-poštnega naslova in gesla ni pravilna!"});
        }
    })(req,res);
}
const preberiIzbranega = (req, res) => { //ok
    if(!req.params.idUporabnika){
        return res.status(400).json({
            "sporočilo": "Ne najdem uporabnika. idUporabnika je obvezen parameter."
        });
    }
    Uporabnik
    .findById(req.params.idUporabnika)
    .exec((napaka,uporabnik) =>{
        if(!uporabnik){
            return res.status(404).json({
                "sporočilo": "Ne najdem uporabnika s podanim enoličnim indetifikatorjem idUporabnika."
            });
        } else if(napaka){
            return res.status(500).json(napaka);
        }
        return res.status(200).json(uporabnik);
    });
  };
const posodobiIzbranega = (req, res) => { //ok
    if(!req.params.idUporabnika){
        return res.status(400).json({
            "sporočilo": "Ne najdem parameter idUporabnika. idUporabnika je obvezen parameter."
        });
    }
    if(!req.body.novoUporabniskoIme || new RegExp(/<\/?[a-z][\s\S]*>/i).test(req.body.novoUporabniskoIme)){
        return res.status(400).json({
            "sporočilo": "Novo uporabniško ime je obvezen parameter in ne sme vsebovati posebnih znakov!"
        })
    }
    
    Uporabnik.findOne(
        {
            "_id":req.params.idUporabnika
        },(napaka,uporabnik) => {
                   if(napaka){
                    return res.status(500).json(napaka);
                   }else{

                            if(!uporabnik){
                                return res.status(404).json({"sporočilo":"Uporabnik ne obstaja v baziQ!"});
                            }
                            uporabnik.uporabniskoIme = req.body.novoUporabniskoIme;
                            uporabnik.save();
                            return res.status(200).json({
                                "sporočilo": "Uporabniško ime uspešno spremenjeno!"
                            });
                   }         
                }
    )
  };
const posodobiGeslo = (req, res) => { //ok
    if(!req.params.idUporabnika){
        return res.status(400).json({
            "sporocilo": "Ne najdem parameter idUporabnika oz. je napačen format id-ja. idUporabnika je obvezen parameter."
        });
    }
    if(!req.body.trenutnoGeslo || !req.body.novoGeslo || !req.body.potrdiNovoGeslo || new RegExp(/<\/?[a-z][\s\S]*>/i).test(req.body.trenutnoGeslo)     || new RegExp(/<\/?[a-z][\s\S]*>/i).test(req.body.novoGeslo)  || new RegExp(/<\/?[a-z][\s\S]*>/i).test(req.body.potrdiNovoGeslo)  ){
        return res.status(400).json({
            "sporocilo": "Eno izmed zahtevanih gesel ni vnešeno ali ni pravilnega formata. Gesla morajo biti nujno vnešena."
        });
    }
    var novoGeslo  = req.body.novoGeslo; var potrdiGeslo = req.body.potrdiNovoGeslo;

    if(!(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(novoGeslo)) || novoGeslo != potrdiGeslo){
        return res.status(400).json({
            "sporočilo": "Geslo ne ustreza zahtevanim kriterijemnodemon! Če si karkoli na strani dregal spravi to v nazaj v normalno stanje in poglej kaj si mogoče naredil narobe."
        });
    }
    Uporabnik
    .findOne( {"_id":req.params.idUporabnika},
    (napaka,uporabnik) =>{
        if(napaka){
            return res.status(500).json(napaka);
        }else{
            if(!uporabnik){
                return res.status(404).json({"sporočilo": "Uporabnika ni v bazi."});
            }else{
                if(!uporabnik.posodobiGeslo(req.body.trenutnoGeslo,req.body.novoGeslo,req.body.potrdiNovoGeslo)){
                    return res.status(400).json({"sporočilo":"Eno izmed podanih gesel ni pravilno!"});
                }
                uporabnik.save();
                return res.status(200).json({"sporočilo": "Geslo uspešno spremenjeno!"});
            }
        }



    });
  };
const vnosZetona = (req,res) =>{ //ok
    console.log(req.body);
    if(!req.body.ePosta ){
        return res.status(400).json({
            "sporočilo": "Epošta uporabnika manjka! Parameter je obvezen"
        });
    }
    if(!(new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(req.body.ePosta))){
        return res.status(400).json({
            "sporočilo": "Izgleda da nisi študent UL! Hm, "
        });
    }
  
    var generiranZeton = pomozneFunkcije.generirajObnovitveniZeton();
    Uporabnik.findOne(
    {
        "ePosta":req.body.ePosta
    },
    (napaka,uporabnik) => {
        if(napaka){
            console.log(napaka);
            return res.status(500).json({"sporočilo":"Zgodila se je nepričakovana napaka"});
        }
        if(!uporabnik){
            return res.status(404).json({"sporočilo":"Če misliš, da bi moral biti registriran vprašaj osebje, če si res."});
        }
        uporabnik.nastaviZeton(generiranZeton);
       
        if(!pomozneFunkcije.posljiObnovitveniZeton(generiranZeton,req.body.ePosta)){
            return res.status(500).json({"sporočilo": "Zgodila se je interna napaka funkcije, ki pošilja maile. Kontaktiraj osebje"});
        }
        uporabnik.save();
        return res.status(200).json({"sporočilo": "Žeton poslan na mail."});    
    }
    );
  };

const obnoviGeslo = (req,res) => { //ok 
    console.log(req.body);
    
    if(!req.body.ePosta || !req.body.zetonZaPosodobitev || !req.body.novoGeslo || !req.body.ponoviNovoGeslo){
        return res.status(400).json({
            "sporočilo" : "Parametri Email, žeton, novo geslo in ponovitev novega gesla so obvzeni!" //kak bi to 
        });
    }
    if(!new RegExp("[A-Za-z0-9]{40}").test(req.body.zetonZaPosodobitev)){
        return res.status(400).json({
            "sporočilo": "Takšen format žetona ne obstaja! Think again."
        });
    }
    if(!(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(req.body.novoGeslo)) || req.body.novoGeslo != req.body.ponoviNovoGeslo){
        return res.status(400).json({
            "sporočilo": "Geslo mora ustrezati naslednjim kriterijem: Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!"
        }) 
    }  
    Uporabnik
    .findOne({
        "ePosta":req.body.ePosta,
    },(napaka,uporabnik) =>{
        if(napaka){
            return res.status(500).json({"sporočilo":"Neznana napaka pri obnavljanju gesla"});
        }if(!uporabnik) { 
            return res.status(404).json({"sporočilo": "Če misliš, da bi moral biti registriran vprašaj osebje, če si res."});
        }
        if(!uporabnik.preveriZeton(req.body.zetonZaPosodobitev)){
            uporabnik.nastaviZeton(pomozneFunkcije.generirajObnovitveniZeton()); return res.status(404).json({"sporočilo": "Ta žeton ne obstaja"});
        } 
        uporabnik.nastaviGeslo(req.body.novoGeslo)
        uporabnik.nastaviZeton(pomozneFunkcije.generirajObnovitveniZeton());
        uporabnik.save();
        return res.status(200).json({"sporočilo": "Geslo uspešno obnovljeno!"});
    }
    );

}
const izbrisiIzbranega = (req, res) => { //ok
     const {idUporabnika} = req.params;
        if(idUporabnika){
            Uporabnik
            .findByIdAndRemove(idUporabnika)
            .exec((napaka) =>{
                if(napaka){
                    return res.status(500).json(napaka);
                }
              return res.status(204).json(null);
            });
        }
        else{
          return  res.status(404).json({
                "sporočilo": "Ne najdem uporabnika, idUporabnika je obvezen parameter."
            });
        }     
  };

  module.exports = {
        prikazi,
        registrirajUporabnika,
        pridobiPrijavnePodatkeUporabnika,
        preberiIzbranega,
        posodobiIzbranega,
        posodobiGeslo,
        obnoviGeslo,
        vnosZetona,
        izbrisiIzbranega   
  };