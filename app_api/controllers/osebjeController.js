const mongoose = require('mongoose');
const Osebje = mongoose.model('Osebje');
const pomozneFunkcije = require('../pomozneFunkcije');


const osebjePridobi = (req, res) => {
    Osebje.find(function(napaka, osebje) {
        if (napaka) {
            res.status(404).json({
                "sporocilo":
                    "Napaka pri pridobivanju osebja."
            });
        } else {
            res.status(200).json(osebje);
        }
        
    });
};

const osebjeDodaj = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    console.log("api -> " + req.body.akademskiNaziv)
    Osebje.create({
        akademskiNaziv: req.body.akademskiNaziv,
        izobrazba: req.body.izobrazba,
        ime_priimek: req.body.ime_priimek,
        e_mail: req.body.e_mail,
        opis: req.body.opis,
    }, (napaka, osebje) => {
        if (napaka) {
            res.status(400).json(napaka);
      } else {
            res.status(201).json(osebje);
      }
    });
};

const osebjePosodobi = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    if (!req.params.idOseba) {
        return res.status(404).json({
            "sporocilo":
                "Ne najdem osebe, idOseba je obvezen parameter."
        });
    }
    Osebje
        .findById(req.params.idOseba)
        .select()
        .exec((napaka, osebje) => {
            if (!osebje) {
                return res.status(404).json({"sporocilo": "Ne najdem osebe."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            osebje.akademskiNaziv = req.body.akademskiNaziv;
            osebje.izobrazba = req.body.izobrazba;
            osebje.ime_priimek = req.body.ime_priimek;
            osebje.e_mail = req.body.e_mail;
            osebje.opis = req.body.opis;
            osebje.save((napaka, osebje) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.status(200).json(osebje);
                }
            });
        });
};

const osebjeIzbrisi = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    const {idOseba} = req.params;
    if (idOseba) {
        Osebje
            .findByIdAndRemove(idOseba)
            .exec((napaka) => {
                if (napaka) {
                    return res.status(500).json(napaka);
                }
                res.status(204).json(null);
            });
    } else {
        res.status(404).json({
            "sporočilo":
                "Ne najdem osebe, idOseba je obvezen parameter."
        });
    }
};

module.exports = {
    osebjePridobi,
    osebjeDodaj,
    osebjePosodobi,
    osebjeIzbrisi
}