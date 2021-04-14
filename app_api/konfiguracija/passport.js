const passport = require('passport');
const LokalnaStrategija = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');

passport.use(
    new LokalnaStrategija(
        {
            usernameField: 'ePosta',
            passwordField: 'geslo'
        },
        (uporabniskoIme,geslo,pkKoncano) =>{
            Uporabnik.findOne(
                {
                    ePosta:uporabniskoIme
                },
                (napaka,uporabnik) =>{
                    if(napaka){
                        return pkKoncano(napaka);
                    }
                    if(!uporabnik){
                        return pkKoncano(null,false,{
                            "sporočilo": "Jah, glej, nekaj ne štima, če ne drugo se registriraj al pa obnovi geslo."
                        });
                    }
                    if(!uporabnik.preveriGeslo(geslo)){
                        return pkKoncano(null,false,{
                        });
                    }
                    return pkKoncano(null, uporabnik);
                }
            );
        }
    )
);