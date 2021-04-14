const mongoose = require('mongoose');
//const Gradivo = mongoose.model('Gradivo');
const Predmet = mongoose.model('Predmet');
const Osebje = mongoose.model('Osebje');

const iskanje = async (req, res, next) => {
    try {
        var regex = new RegExp(req.query.iskalniIzraz, 'i');

        /*
        var gradiva = await Gradivo.find({
            visibility: true,
            $or: [
                {
                    'datoteka.ime': regex,
                },
                {
                    povezava: regex
                }
            ]
        });

        var gradivaIds = gradiva.map(g => g._id);
        */

        var predmeti;
        /*
        if (gradivaIds.length == 0) {
            predmeti = await Predmet.find({
                $or: [
                    {
                        ime: regex,
                    }
                ]
            });
        }
        else {
        */
        predmeti = await Predmet.find({
            $or: [
                {
                    ime: regex,
                }
                /*
                {
                    gradiva: {
                        _id: {
                            $in: gradivaIds
                        }
                    }
                }
                */
            ]
        });
        
        

        var predmetProfesorji = predmeti.map(p => p.profesorji).flat();
        var predmetAsistenti = predmeti.map(p => p.asistenti).flat();
        var predmetOsebje = predmetProfesorji.concat(predmetAsistenti);

        var osebje;
        if (predmetOsebje.length == 0) {
            osebje = await Osebje.find({
                $or: [
                    {
                        ime_priimek: regex
                    }
                ]
            });
        }
        else {
            osebje = await Osebje.find({
                $or: [
                    {
                        ime_priimek: regex
                    },
                    {
                        _id: {
                            $in: predmetOsebje
                        }
                    }
                ]
            });
        }

        var formatiraniPredmeti = predmeti.map(p => {
            return {
                _id: p._id,
                ime: p.ime,
                tip: 'predmet'
            };
        });

        /*
        var formatiranoGradivo = gradiva.map(g => {
            var predmet = formatiraniPredmeti.find(p => p._id == g.predmet);
            
            return {
                _id: g._id,
                ime: g.datoteka.ime,
                povezava: g.povezava,
                predmet: predmet,
                tip: 'gradivo'

            };
        });
        */

        var formatiranoOsebje = osebje.map(o => {
            return {
                _id: o._id,
                ime_priimek: o.ime_priimek,
                tip: 'osebje'
            };
        });

        
        var zadetki = [];
        // filtriranje
        /*
        if (JSON.parse(req.query.gradivo))
            zadetki.push(formatiranoGradivo);
        */
        if (JSON.parse(req.query.predmeti)) 
            zadetki.push(formatiraniPredmeti);
            
        if (JSON.parse(req.query.osebje)) 
            zadetki.push(formatiranoOsebje);

        //tuki slice za pagination
        zadetki = zadetki.flat();
        var vseh = zadetki.length;

        // ce je do konca arraya manj kot jih pase na stran potem vrni samo konec, drugace pa vmesni del
        let offset = Number(req.query.offset);
        let limit = Number(req.query.limit);
        if ((offset + limit) < zadetki.length) {
            zadetki = zadetki.slice(offset, offset+limit)
        } else {
            zadetki = zadetki.slice(-(vseh-offset));

        }


        res.json({
            /*
            gradiva: formatiranoGradivo,
            predmeti: formatiraniPredmeti,
            osebje: formatiranoOsebje
            */
           zadetki: zadetki,
           vseh: vseh
        });
    }
    catch (napaka) {
        next(napaka);
        return res.status(404).json({
            "sporocilo":
                "Napaka pri pridobivanju rezultatov iskanja."
        });
    }
}


module.exports = {
    iskanje
};