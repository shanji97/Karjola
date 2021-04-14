const mongoose = require('mongoose');
const Predmeti = mongoose.model('Predmet');
const pomozneFunkcije = require('../pomozneFunkcije');

const formatOsebje = (osebje) => {
    return {
        _id: osebje._id,
        ime_priimek: osebje.ime_priimek,
        izobrazba: osebje.izobrazba,
        akademskiNaziv: osebje.akademskiNaziv,
        opis: osebje.opis
    };
};

const formatKomentar = (kom, uporabnik) => {
    var avtor = null;
    if (!kom.anonimnost 
        || uporabnik.jeAdmin 
        || uporabnik._id.toString() == kom.avtor._id.toString()) {
        avtor = {
            _id: kom.avtor._id,
            uporabniskoIme: kom.avtor.uporabniskoIme
        };
    }

    return {
        _id: kom._id,
        avtor: avtor,
        anonimnost: kom.anonimnost,
        datum: kom.datum,
        stPrijav: kom.stPrijav,
        besedilo: kom.besedilo
    }
};

const formatGradivo = (gradivo, uporabnik) => {
    var formatGradivo = {
        _id: gradivo._id,
        stPrijav: gradivo.stPrijav,
        vidno: gradivo.vidno,
        komentarji: gradivo.komentarji.map(k => formatKomentar(k, uporabnik))
    }

    if (gradivo.isFile) 
        formatGradivo.ime = gradivo.datoteka.ime;
    else 
        formatGradivo.ime = formatGradivo.povezava = gradivo.povezava;

    return formatGradivo;
};

const formatPredmet = (predmet, uporabnik) => {
    var formatProfesorji = predmet.profesorji.map(formatOsebje);
    var formatAsistenti = predmet.asistenti.map(formatOsebje);
    var formatGradiva = predmet.gradiva.map(g => formatGradivo(g, uporabnik));
    return {
        _id: predmet._id,
        ime: predmet.ime,
        opis: predmet.opis,
        profesorji: formatProfesorji,
        asistenti: formatAsistenti,
        moduli: predmet.moduli,
        letnik: predmet.letnik,
        semester: predmet.semester,
        vrstaIzbirnega: predmet.vrstaIzbirnega,
        stGradiv: formatGradiva.length,
        gradiva: formatGradiva
    };
};

const predmetiPridobi = async (req, res, next) => {
    try {
        var predmeti = await Predmeti.find();

        res.status(200);
        res.json(predmeti.map(predmet => {
            return {
                _id: predmet._id,
                ime: predmet.ime,
                opis: predmet.opis,
                profesorji: predmet.profesorji,
                asistenti: predmet.asistenti,
                moduli: predmet.moduli,
                letnik: predmet.letnik,
                semester: predmet.semester,
                vrstaIzbirnega: predmet.vrstaIzbirnega,
                stGradiv: predmet.gradiva.length,
                gradiva: predmet.gradiva
            };
        }));
    }
    catch (napaka) {
        next(napaka);
        return res.status(404).json({
            "sporocilo":
                "Napaka pri pridobivanju predmetov."
        });
    }
};

const predmetiPridobiById = async (req, res, next) => {
    try {
        var uporabnik = await pomozneFunkcije.vrniUporabnika(req);
        if (!uporabnik) {
            uporabnik = { 
                _id: null, 
                isAdmin: false 
            };
        }

        var predmet = await Predmeti.findById(req.params.predmetId)
            .populate('profesorji')
            .populate('asistenti')
            .populate('moduli')
            .populate({
                path: 'gradiva',
                match: {
                    $or: [
                        {
                            vidno: true
                        },
                        {
                            vidno: pomozneFunkcije.jeAdmin(uporabnik) ? false : true
                        }
                    ]
                },
                select: {
                    'datoteka.data': 0
                },
                populate: {
                    path: 'komentarji',
                    populate: {
                        path: 'avtor',
                        select: {
                            _id: 1,
                            uporabniskoIme: 1
                        }
                    }
                }
            });
        
        if (!predmet) {
            res.status(404);
            res.send({
                napaka: 'Ta predmet ne obstaja'
            });
        }
        else {
            res.status(200).json(formatPredmet(predmet, uporabnik));
        }
    }
    catch (napaka) {
        next(napaka);
    }
} 


const posodobiPredmet = async (predmetId,ime, letnik, semester, vrstaIzbirnega, profesorji, asistenti, moduli, opis) => {

    var predmet = await Predmeti.findById(predmetId);
    if (!predmet || !ime || letnik===-1 || !profesorji ) {
        console.log(predmet)
        console.log("predmet, ime, letnik, vrstaIzirnega, profesorji so potrebni podatki!");
    } else {
        try {
            predmet.ime = ime;
            predmet.letnik = letnik;
            predmet.semester = semester;
            predmet.profesorji = profesorji;
            predmet.asistenti = asistenti;
            predmet.moduli = moduli;
            predmet.vrstaIzbirnega = vrstaIzbirnega;
            predmet.opis = opis;
            await predmet.save();
            return predmet;
            /*
            let profi = await Osebje.find().where('_id').in(profesorji).exec();
            predmet.profesorji = profi;
            await predmet.save();
            console.log(`profesorji vstavljeni -> ${profesorji.moduli}`);
            */

        }
        catch (err) {
            logger.error('API', err);
            return err;
        }
    }
};

const predmetiDodaj = async (req, res) => {

    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    // Iz kontrollerja se dobi string Id profesorjev in asistentov
    // Tuki je treba to pretvorit v dejanske elemente v bazi in jih vstavit
    console.log("dodajam predmet v api");
    Predmeti.create({

    }, (napaka, predmet) => {
        if (napaka) {
            console.log(napaka);
            res.status(400).json(napaka);
        } else {
            // Predmet ustvarjen treba je dodati se profesorje
            posodobiPredmet(predmet._id, req.body.ime, req.body.letnik, req.body.semester, req.body.vrstaIzbirnega, req.body.profesorji, req.body.asistenti, req.body.moduli, req.body.opis)
                .then((predmet) => {
                    console.log("kao ustvarjen predmet: " + predmet);
                    res.status(201).json(predmet);
                })
                .catch((err) => {
                    res.status(500).json(err);
                });
        }
    });

};

const predmetiPosodobi2 = (req, res) => {
    if (!req.params.idPredmet) {
        return res.status(404).json({
            "sporocilo":
                "Ne najdem predmeta, idPredmet je obvezen parameter."
        });
    }
    Predmeti
        .findById(req.params.idPredmet)
        .select()
        .exec((napaka, predmet) => {
            if (!predmet) {
                return res.status(404).json({"sporocilo": "Ne najdem predmeta."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }
            predmet.ime = req.body.ime;
            predmet.opis = req.body.opis;
            predmet.letnik = req.body.letnik;
            predmet.semester = req.body.semester;
            predmet.vrstaIzbirnega = req.body.vrstaIzbirnega;
            predmet.splošni = req.body.splošni;
            predmet.save((napaka, predmet) => {
                if (napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.status(200).json(predmet);
                }
            });
        });
};

const predmetiPosodobi = async (req, res) => {

    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    posodobiPredmet(req.body._id, req.body.ime, req.body.letnik, req.body.semester, req.body.vrstaIzbirnega, req.body.profesorji, req.body.asistenti, req.body.moduli, req.body.opis, res)
        .then((predmet) => {
            res.status(201).json(predmet);
        })
        .catch((err) => {
            res.status(500).json(err);
        });    
};

const predmetiIzbrisi = async (req, res) => {
    const uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!uporabnik || !pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(401).json({
            "sporocilo":
                "Ne najdem uporabnika oz. ni administrator."
        });
    }

    const {idPredmet} = req.params;
    if (idPredmet) {
        Predmeti
            .findByIdAndRemove(idPredmet)
            .exec((napaka) => {
                if (napaka) {
                    return res.status(500).json(napaka);
                }
                res.status(204).json(null);
            });
    } else {
        res.status(404).json({
            "sporočilo":
                "Ne najdem predmeta, idPredmet je obvezen parameter."
        });
    }
};

module.exports = {
    predmetiPridobi,
    predmetiPridobiById,
    predmetiDodaj,
    predmetiPosodobi,
    predmetiIzbrisi
}