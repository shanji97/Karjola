const nodemailer = require("nodemailer"); //nodemailer za pošiljanje e-pošte uporabnikom
const {google} = require('googleapis'); //po možnosti se reši gulaga in zrihtaj nekaj drugega
const mongoose = require('mongoose'); //lažje delo z MongoDB bazo
const Uporabnik = mongoose.model('Uporabnik'); //model Uporabnik -> /app_api/models/uporabnik.js

//ENOSTAVNE FUNKCIJE
//Vrnemo uporabnika glede na to ali obstaja payload in ali je v tem payloadu ePosta ( payload = JWT)
    //Vhod: zahteva (payload - JWT -> epošta)
    //Izhod: objekt tipa uporabnik po mongoose modelu oz. null, če uporabnik ne obstaja v bazi
async function vrniUporabnika(req) {
    if (req.payload && req.payload.ePosta) {
        const uporabnik = Uporabnik.findOne({ePosta: req.payload.ePosta});
        if (!uporabnik) return null;
        return uporabnik;
    } else {
        return null;
    }
}
//Preverimo, če je uporabnik administrator
    //Vhod: objekt tipa uporabnik iz mongoose modela
    //Izhod: vrednost true/false glede na to ali uporabnik je 
function jeAdmin(uporabnik) {
    if (uporabnik.jeAdmin) return true;
    return false;
    //mogoče bi bilo smiselno, dati to v models
}
//Generiramo naključni žeton sestavljen iz vzorca A-Za-z0-9
    //Vhod: dolžina končnega naključnega niza žetona, ki ga želimo imeti (privzeto 40)
    //Izhod: "naključen" niz znakov, dolg toliko, na kolikor določena je vhodna dolžina 
function generirajObnovitveniZeton(dolzina = 40){
    var rezultat = "";
    var znaki ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var dolzinaZnakov  = znaki.length;
    for(var i = 0; i < dolzina; i++){
        rezultat += znaki.charAt(Math.floor(Math.random()*dolzinaZnakov));
    }
    return rezultat;
}

//EMAIL
//Uporabniku pošljemu obnovitveni zeton
    //Vhod: generiran žeton za obnovitev gesla & email uporabnika na katerega se žeton pošlje
    //Izhod: vrednost true/false, glede na to, ali se je pošiljanje izvršilo uspešno oz. vrne se napaka pri pošiljanju
async function posljiObnovitveniZeton(zeton = "" , ePosta =""){
    try{
        if(zeton == "" || ePosta =="") return false;

        //Oauth2
        const googleOauth2Client = new google.auth.OAuth2(process.env.OAUTH2_CLIENT_ID, process.env.OAUTH2_CLIENT_SECRET,'https://developers.google.com/oauthplayground');
              googleOauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
        const dostopniZeton = await googleOauth2Client.getAccessToken();
        console.log(dostopniZeton);
        
        var besediloPoste = `
        <p>Karjola ti je pripeljala link do obnovitve gesla</p>
        <p>Žeton "${zeton}" vneseš na strani, na katero te je preusmerilo spletno mesto</p>
        <p> Če nisi tega gesla zahteval(a) ti, to spročilo ignoriraj.</p>`;
        /*
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.POSILJATELJ,
                pass: process.env.POSILJATELJ_GESLO
            }
        });*/
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                type: 'OAuth2',
                user: process.env.POSILJATELJ,
                clientId: process.env.OAUTH2_CLIENT_ID,
                clientSecret: process.env.OAUTH2_CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
                accessToken: dostopniZeton
            }       
        });

        let nastavitvePoste = {
            from: '"Karjola Support" <' + process.env.POSILJATELJ +'>',
            to: `${ePosta}`,
            subject: "Žeton za obnovitev gesla",
            text: "Evo tu maš žeton!",
            html: besediloPoste
        }
       const rezultat = await transporter.sendMail(nastavitvePoste);
       return rezultat;
    }catch(napaka){


        return napaka;
    }
    
}

//funkcije za validacijo






module.exports = {
    generirajObnovitveniZeton,
    posljiObnovitveniZeton,
    vrniUporabnika,
    jeAdmin
};