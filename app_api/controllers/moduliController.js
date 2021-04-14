const mongoose = require('mongoose');
const Moduli = mongoose.model('Modul');
const pomozneFunkcije = require('../pomozneFunkcije');
  

const moduliPridobi = (req, res) => {
    Moduli.find(function(napaka, moduli) {
        if (napaka) {
            res.status(404).json({
                "sporocilo":
                    "Napaka pri pridobivanju modulov."
            });
        } else {
            res.status(200).json(moduli);
        }
        
    });
};
// dodaj nov modul
const moduliDodaj = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    Moduli.create({
        ime: req.body.ime
    }, (napaka, modul) => {
        if (napaka) {
            res.status(400).json(napaka);
      } else {
            res.status(201).json(modul);
      }
    });
};
const moduliPosodobi = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    if (!req.params.idModula) {
        return res.status(404).json({
            "sporocilo":
                "Ne najdem modula, idModula je obvezen parameter."
        });
    }
    Moduli
        .findById(req.params.idModula)
        .select()
        .exec((napaka, modul) => {
            if (!modul) {
                return res.status(404).json({"sporocilo": "Ne najdem modula."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            modul.ime = req.body.ime;
            console.log(req.body.ime);
            modul.save((napaka, modul) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.status(200).json(modul);
                }
            });
        });
};



const moduliIzbrisi = async(req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    const idModula = req.params.idModula;
    if (!idModula) {
        return res.status(404).json({
          "sporočilo":
            "Ne najdem lokacije oz. komentarja, " +
            "idModula je obvezen parameter."
        });
    }
    Moduli.findByIdAndRemove(
        idModula,
        (napaka, modul) => {
            if (napaka) {
                res.status(400).json(napaka);
            } else {
                res.status(204).json(modul);
            }
    });
};

module.exports = {
    moduliPridobi,
    moduliDodaj,
    moduliPosodobi,
    moduliIzbrisi
}