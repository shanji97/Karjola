const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');;


async function vrniUporabnika(req) {
    if (req.payload && req.payload.ePosta) {
        const uporabnik = Uporabnik.findOne({ePosta: req.payload.ePosta});
        if (!uporabnik) return null;
        return uporabnik;
    } else {
        return null;
    }
}

function jeAdmin(uporabnik) {
    if (uporabnik.jeAdmin) return true;
    return false;
}

function generirajObnovitveniZeton(dolzina = 40){
    var rezultat = "";
    var znaki ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var dolzinaZnakov  = znaki.length;
    for(var i = 0; i < dolzina; i++){
        rezultat += znaki.charAt(Math.floor(Math.random()*dolzinaZnakov));
    }
    return rezultat;
}
function posljiObnovitveniZeton(zeton = "" , ePosta ="")
{
    if(zeton == "" || ePosta =="") return false;

    var besediloPoste = `
    <p>Karjola ti je pripeljala link do obnovitve gesla</p>
    <p>Žeton "${zeton}" vneseš na strani, na katero te je preusmerilo spletno mesto</p>
    <p> Če nisi tega gesla zahteval(a) ti, to spročilo ignoriraj.</p>`;
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.POSILJATELJ,
            pass: process.env.POSILJATELJ_GESLO
        }
    });
    let nastavitvePoste = {
        from: '"Karjola Support" <' + process.env.POSILJATELJ +'>',
        to: `${ePosta}`,
        subject: "Žeton za obnovitev gesla",
        text: "Evo tu maš žeton!",
        html: besediloPoste
    }
    transporter.sendMail(nastavitvePoste, function(napaka,odgovor){
        if(napaka){
            console.log("Zgodila se je napaka");
            return false;
        }else{
            console.log("Sporočilo uspešno poslano");
            return true;
        }
    });
    
return true;
}
module.exports = {
    generirajObnovitveniZeton,
    posljiObnovitveniZeton,
    vrniUporabnika,
    jeAdmin
};