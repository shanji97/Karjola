const { BSONType } = require('mongodb');
const mongoose = require('mongoose');
const { userInfo } = require('os');
const fs = require('fs').promises;

const Predmet = mongoose.model('Predmet');
const Komentar = mongoose.model('Komentar');
const Gradivo = mongoose.model('Gradivo');
const Osebje = mongoose.model('Osebje'); 
const Modul = mongoose.model('Modul');
const Uporabnik = mongoose.model('Uporabnik'); //v /models je že od začetka poimenovano user -> preimenovati ASAP

const moduliJson = require('../db/moduli.json');
const osebjeJson = require('../db/osebje.json');
const predmetJson = require('../db/predmeti.json');
const uporabnikJson = require('../db/uporabniki.json');
const gradivoJson = require('../db/gradiva.json')
const pomozneFunkcije  = require('../pomozneFunkcije');
const vnosBaze = async (req, res) => {

    console.log("API vnos baze");
    try {
        var moduli = await Modul.insertMany(moduliJson);
        var osebje = await Osebje.insertMany(osebjeJson);
        var predmeti = await Predmet.insertMany(predmetJson);
        var uporabniki = await Uporabnik.insertMany(uporabnikJson);
        var gradiva = await Gradivo.insertMany(gradivoJson);

        if (!moduli || !predmeti || !osebje ||!uporabniki || !gradiva) {
            return res.status(404).send();
        }
        else {
            return res.status(201).send();
        }
    }
    catch (napaka) {
        console.log(napaka);
        return res.status(500).send();
    }
}
const izbrisBaze = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if(!uporabnik){
        return res.status(404).json({
            "sporočilo":
                "Ne najdem uporabnika."
        });
    }
    if(!pomozneFunkcije.jeAdmin(uporabnik)){
        return res.status(401).json({
            "sporočilo":
                "Nisi administrator."
        });
    }
    try {
        var moduli = await Modul.deleteMany();
        var osebje = await Osebje.deleteMany();
        var predmeti = await Predmet.deleteMany();
        var uporabniki = await Uporabnik.deleteMany();
        var gradiva = await Gradivo.deleteMany();
        var komentarji = await Komentar.deleteMany();

        if (moduli && osebje && predmeti && uporabniki && gradiva && komentarji) {
            console.log("izbrisano :)");
            return res.status(204).send();
        }
    }
    catch (napaka) {
        return res.status(404).send();
    }
}


module.exports = {
    vnosBaze,
    izbrisBaze
}