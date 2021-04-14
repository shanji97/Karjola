const mongoose = require('mongoose');
const pomozneFunkcije = require('../pomozneFunkcije');
const fs = require('fs').promises;
const Predmet = mongoose.model('Predmet');
const Gradivo = mongoose.model('Gradivo');
const Komentar = mongoose.model('Komentar');
const Uporabnik = mongoose.model('Uporabnik');

const izhodnaOblikaGradiva = (gradivo) => {
    return{
        _id: gradivo._id,
        predmet: gradivo.predmet,
        ime: gradivo.isFile ? gradivo.datoteka.ime : gradivo.povezava,
        stPrijav: gradivo.stPrijav,
        povezava: gradivo.povezava,
        vidno: gradivo.vidno
    };
}

const izhodnaOblikaKomentarja = (komentar, avtor) => {
    return {
        _id: komentar._id,
        datum: komentar.datum,
        gradivo: komentar.gradivo,
        predmet: komentar.predmet,
        avtor: {
            _id: avtor._id,
            uporabniskoIme: avtor.uporabniskoIme
        },
        besedilo: komentar.besedilo
    };
}

const pridobiGradivo = async (req, res, next) => {
    try {
        var gradivo = await Gradivo.findById(req.params.idGradiva);
        if (!gradivo) {
            return res.status(404).send();
        }

        if (gradivo.isFile) {
            res.attachment(gradivo.datoteka.ime);
            res.status(200).send(gradivo.datoteka.data);
        }
        else {
            res.status(200).redirect(gradivo.povezava);
        }
    }
    catch (napaka) {
        next(napaka);
    }
}

const jeVeljavenURL = (url) => {
    var regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]+\.[a-zA-Z0-9()]+\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return regex.test(url);
}

const naloziGradivo = async (req, res, next) => {
    var uporabnik = await pomozneFunkcije.vrniUporabnika(req);

    try {
        var predmet = await Predmet.findById(req.params.idPredmeta);
        if (!predmet) {
            return res.status(404).send();
        }

        var gradivo;
        if (req.file) {
            var buffer = req.file.buffer;

            gradivo = new Gradivo({
                predmet: predmet._id,
                datoteka: {
                    ime: req.file.originalname,
                    data: buffer,
                    contentType: 'application/octet-stream'
                },
                isFile: true,
                avtor: uporabnik._id
            });
        }
        else if (req.body.povezava) {
            if (jeVeljavenURL(req.body.povezava)) {
                gradivo = new Gradivo({
                    predmet: predmet._id,
                    isFile: false,
                    povezava: req.body.povezava,
                    avtor: uporabnik._id
                });
            }
            else { 
                res.status(400).json({
                    napaka: 'Neveljaven URL naslov'
                });
            }
        }
        else {
            console.log("ni povezave");
            return res.status(400).json({
                napaka: 'Podana mora biti datoteka ali povezava'
            });
        }
    
        await gradivo.save();

        predmet.gradiva.push(gradivo._id);
        await predmet.save();
        res.status(201).json(izhodnaOblikaGradiva(gradivo));
    }
    catch (napaka) {
        if (napaka instanceof mongoose.Error.ValidationError) {
            res.status(400).json({
                napaka: 'Validacija je spodletela',
                sporocilo: napaka.message
            });
        }
        else {
            next(napaka);
        }
    }
}

const izbrisiGradivo = async (req, res, next) => {
    var uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(403).json({
            sporocilo: "Gradivo lahko briše samo administrator."
        });
    }

    try {
        let gradivo = await Gradivo.findByIdAndDelete(req.params.idGradiva).select({ 'datoteka.data': 0 });
        if (!gradivo) {
            res.status(404).json({
                napaka: 'To gradivo ne obstaja'
            });
        }
        else {
            res.status(200).json(izhodnaOblikaGradiva(gradivo));
        }
    }
    catch (napaka) {
        next(napaka);
    }
}

const preklopiVidljivostGradiva = async (req, res, next) => {
    var uporabnik = await pomozneFunkcije.vrniUporabnika(req);
    if (!pomozneFunkcije.jeAdmin(uporabnik)) {
        return res.status(403).json({
            sporocilo: "Gradivo lahko nadzira samo administrator."
        });
    }

    try {
        var gradivo = await Gradivo.findById(req.params.idGradiva);

        gradivo.vidno = !gradivo.vidno;
        await gradivo.save();

        res.status(200).json(izhodnaOblikaGradiva(gradivo));
    }
    catch (napaka) {
        next(napaka);
    }
}

const prijaviGradivo = async (req, res, next) => {
    try {
        var gradivo = await Gradivo.findById(req.params.idGradiva);
        gradivo.stPrijav++;
        await gradivo.save();

        res.json(izhodnaOblikaGradiva(gradivo));
    }
    catch (napaka) {
        next(napaka);
    }
}

const objaviKomentar = async (req, res, next) => {
    var uporabnik = await pomozneFunkcije.vrniUporabnika(req);

    try {
        var gradivo = await Gradivo.findById(req.params.idGradiva);
        if (!gradivo) {
            return res.status(404).send({
                napaka: 'To gradivo ne obstaja'
            });
        }

        var komentar = await Komentar.create({
            gradivo: gradivo._id,
            predmet: gradivo.predmet,
            besedilo: req.body.komentar,
            anonimnost: req.body.anonimno == true,
            avtor: uporabnik._id
        });

        gradivo.komentarji.push({ _id: komentar._id });
        await gradivo.save();

        res.status(201).json(izhodnaOblikaKomentarja(komentar, uporabnik));
    }
    catch (napaka) {
        next(napaka);
    }
}

const izbrisiKomentar = async (req, res, next) => {
    var uporabnik = await pomozneFunkcije.vrniUporabnika(req);

    try {
        var komentar = await Komentar.findById(req.params.idKomentar);
        if (komentar) {
            if (!pomozneFunkcije.jeAdmin(uporabnik) && komentar.avtor.toString() != uporabnik._id.toString()) {
                return res.status(403).json({
                    sporocilo: "Komentarje lahko briše samo avtor ali administrator."
                });
            }

            await komentar.delete();
            res.status(200).json(izhodnaOblikaKomentarja(komentar, uporabnik));
        }
        else {
            res.status(404).json({
                sporocilo: 'Ta komentar ne obstaja'
            });
        }
    }
    catch (napaka) {
        console.trace(napaka);
    }
}

const prijaviKomentar = async (req, res, next) => {
    try {
        var komentar = await Komentar.findById(req.params.idKomentar).populate('avtor');
        if (!komentar) {
            return res.status(404).json({
                napaka: 'Ta komentar ne obstaja'
            });
        }

        komentar.stPrijav++;
        await komentar.save();

        res.status(200).json(izhodnaOblikaKomentarja(komentar, komentar.avtor));
    }
    catch (napaka) {
        next(napaka);
    }
}

module.exports = {
    pridobiGradivo,
    naloziGradivo,
    izbrisiGradivo,
    prijaviGradivo,
    preklopiVidljivostGradiva,
    objaviKomentar,
    izbrisiKomentar,
    prijaviKomentar
}