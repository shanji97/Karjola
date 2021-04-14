"use strict";
var regexIzrazi = ["^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})", "[a-z]{2}[0-9]{4}@student.uni-lj.si",/^\d{4}$/,/(<([^>]+)>)/ig ];
var tabelaCredentialov = [];
var tipForme = "",naslov="";

//======PRIDOBI API==================================================
function pridobiPosto(postna_stevilka,callback){

    var zahteva = new XMLHttpRequest();
    var url = "https://api.lavbic.net/kraji/"+ postna_stevilka;
    zahteva.open("GET",url,true);
    zahteva.addEventListener("load",function(){
        if(zahteva.status<400){
            callback(zahteva.responseText);
        }
        else{
            callback(null, new Error("Pošta ne obstaja."));
        }
    });
    zahteva.addEventListener("error",function(){
        callback(null, new Error("Neuspešna povezava."));
    });
    zahteva.send(null);
}
function api(){
    
    var regexZip = new RegExp(regexIzrazi[2]);
    document.getElementById("inputCity").disabled = false;
    document.getElementById("inputCity").value = "";

    if(regexZip.test(document.getElementById("inputZip").value)){
        
        pridobiPosto(document.getElementById("inputZip").value,function(besedilo,napaka){
            if(napaka != null){
                prikaziObvestilo("Napaka pri povezavi!", "Napaka pri povezavi!","danger"); 
            }
            else{               
                document.getElementById("inputCity").value = JSON.parse(besedilo).kraj; naslov =  JSON.parse(besedilo).kraj;
            }
        }); 
    }
    else{       
        prikaziObvestilo("Napačen format poštne številke!", "Poštno številko tvorijo štiri številke. Popravi.","danger"); 
    }
    document.getElementById("inputCity").disabled = true;
}
//========================================================================================================================
function obstaja(vrednost,tip="")
{
    //razširimo ko baza pride
    return false;
}
function prikaziObvestilo(opozornilnoBesediloStrong, opozorilnoBesedilo = "",tipOpozorila){

    //tipi opozoril so danger, warning, succes, info -> od vsakega je v htmlju en primerek
    document.getElementsByClassName("alert-" + tipOpozorila)[0].style.display="block";
    document.getElementById(tipOpozorila + "-strong").innerHTML = opozornilnoBesediloStrong;
    document.getElementById(tipOpozorila + "-navadno").innerHTML = opozorilnoBesedilo;

    setTimeout(function(){    
                            document.getElementsByClassName("alert-"+tipOpozorila)[0].style.display = "none";
    },5000);

  }

  function izbrisHtmlTagov(besedilo){
      return besedilo.replace(regexIzrazi[3],"");
  }
  function preveriVrednosti(polje){
    
    for(var i=0;i<polje.length;i++){
      var vrednostPolja = document.getElementById(polje[i]).value;
      vrednostPolja = izbrisHtmlTagov(vrednostPolja);
      if(vrednostPolja==""){
            return true;
      }
    } return false; //
}
/*======================DOGODKI============================*/
document.getElementById("searchinput").addEventListener("focusout",function(){  var a = preveriVrednosti(document.getElementsByTagName("input")[0].id); /*dopolnimo ko bomo imeli server side*/});
window.addEventListener("load", function() {

    /* QUICK DEBUG var regTest = new RegExp();    console.log(regTest.test("ak3900@student.uni-lj.si"))  console.log(regTest.test("ep8265@student.uni-lj.si")) VRNE TRUE OBOJE*/
    tipForme = document.getElementById("submit").innerHTML;
    var inputs = document.getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++){
        tabelaCredentialov.push(inputs[i].id)
    }
    if(tipForme =="Registriraj se" || tipForme =="Prijavi se" || tipForme =="Ponastavi geslo!" || tipForme =="Ponastavi!"){
        tabelaCredentialov.shift(); //prvi input je search input
    }
  });

//GLAVNA FUNKCIJA, KI SE SPROŽI NA GUMB SUBMIT
document.getElementById("submit").addEventListener("click", function(event){
   
   event.preventDefault();
  
   if(preveriVrednosti(tabelaCredentialov)){
          prikaziObvestilo("Izpolni vsa polja!"," Potrebno je izpolniti vsa polja. Vstavljanje HTML značk je prepovedano!","danger");   
          return;
    }
    //preverjamo glede na tip forme
   
    switch(tipForme)
    {
        /*Opcionalno lahko validiramo vse*/ 
        case "Prijavi se":
        var geslo = document.getElementById(tabelaCredentialov[1]).value;
        case "Ponastavi geslo!":  

        var email = document.getElementById(tabelaCredentialov[0]).value;
        if(!new RegExp(regexIzrazi[1]).test(email)){
            prikaziObvestilo("Vnešeno napačnen format emaila!"," Uporabi svoj študentski email, ki si ga prejel od UL!","danger");
            return;
            }    
        else{
                /*
                if PREVERIMO ČE JE GESLO NASTAVLJENO -> če je null ali "" preverimo samo ali mail obstaja, sicer preverimo še
                */
               prikaziObvestilo("Navodila za ponastavitev gesla uspešno poslana! Če si na formi za prijavo, potem bi še fajn blo da se naprej baza zrihta!"," Poglej mail!","success");

        }       
        break;
        case "Registriraj se":

            if(obstaja(document.getElementById(tabelaCredentialov[0].value))){

                prikaziObvestilo("Uporabnik že obstaja!", " Izberi si drugo uporabniško ime!","danger");
                return;
            }
        
            if(!new RegExp(regexIzrazi[1]).test(document.getElementById(tabelaCredentialov[1]).value) || obstaja(document.getElementById(tabelaCredentialov[0].value)))
            {
                prikaziObvestilo("Preveri e-pošto!"," Zahtevana je pošta od študentskega UL računa. Si prepričan, da se nisi že vpisal?! Probaj se prijaviti/obnoviti geslo ali pa nam pošlji e-mail","danger");
                return;
            }
            if(!document.getElementById(tabelaCredentialov[tabelaCredentialov.length - 1]).checked)
            {
                prikaziObvestilo("Strinjaj se s pogoji!"," Za uporabo strani se je treba strinjati s pravili uporabe in splošnimi pogoji!","danger");
                return;
            }
        
        case "Ponastavi!":
             //če password ustreza regexu  in drug string je enak prvemu je ok
            
             var prvoGeslo  =(tipForme == "Ponastavi!" ? document.getElementById(tabelaCredentialov[0]).value : document.getElementById(tabelaCredentialov[2]).value);
             var drugoGeslo = (tipForme == "Ponastavi!" ? document.getElementById(tabelaCredentialov[1]).value : document.getElementById(tabelaCredentialov[3]).value);

            if(!(new RegExp(regexIzrazi[0]).test(prvoGeslo)) || prvoGeslo != drugoGeslo){
                prikaziObvestilo("Geslo ni vredu!"," Geslo mora ustrezati naslednjim kriterijem: Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo","danger");   
                return;
            }

            prikaziObvestilo("Izpolnjevanje uspešno!","","success");

        break;
    }

   // document.getElementById("forma").submit();  
});
