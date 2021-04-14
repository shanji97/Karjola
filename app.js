require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Karjola",
            version: "1.0.0",
            description: "Karjola REST API"
        },
        license: {
            name: "GNU LGPLv3",
            url: "https://choosealicense.com/licenses/lgpl-3.0"
        },
        contact: {
            name: "Karjola Team",
            url: "https://github.com/sannyi",
            email: "ak3900@student.uni-lj.si"
        },
        servers: [
            {url: "http://localhost:3000/api"},
            {url: "https://sp-lp24-karjola.herokuapp.com/api"}
        ]
    },
    apis: [
        "./app_api/routes/iskanjeRouter.js",
        "./app_api/routes/gradivoRouter.js",
        "./app_api/routes/osebjeRouter.js",
        "./app_api/routes/uporabnikiRouter.js",
        "./app_api/routes/predmetiRouter.js",
        "./app_api/models/osebje.js",
        "./app_api/models/predmet.js",
        "./app_api/models/uporabniki.js",
        "./app_api/routes/bazaRouter.js",
        "./app_api/routes/moduliRouter.js"
    ]
};
const swaggerDocument = swaggerJsDoc(swaggerOptions);


require('./app_api/db/db');
require('./app_api/konfiguracija/passport');

var predmetiApi = require('./app_api/routes/predmetiRouter');
var gradivoApi = require('./app_api/routes/gradivoRouter');
var moduliApi = require('./app_api/routes/moduliRouter');
var osebjeApi = require('./app_api/routes/osebjeRouter');
var iskanjeApi = require('./app_api/routes/iskanjeRouter');
var uporabnikiApi = require('./app_api/routes/uporabnikiRouter');
var gradivoApi = require('./app_api/routes/gradivoRouter');
var bazaApi = require('./app_api/routes/bazaRouter');


var app = express();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api/swagger.json", (req, res) => {
    res.status(200).json(swaggerDocument);
});

//Odprava varnostnih pomanjkljivosti
app.disable('x-powered-by');
app.use((req,res,next)=>{
  res.header('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});


//preusmeritev na HTTPS na Heroku
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`);
        else
            next();
    });
}

// view engine setup
hbs.registerPartials('./app_server/views/partials');
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

//require('./app_server/views/helpers/hbsHelpers');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50MB'}));
app.use(bodyParser.urlencoded({limit: '50MB', extended: true}));
app.use(cookieParser());
//app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

app.use(passport.initialize());

app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

//preusmeritev na HTTPS na Heroku
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`);
        else
            next();
    });
}

app.disable('x-powered-by');
app.use((req,res,next)=>{
res.header('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});


app.use('/api/predmeti', predmetiApi);
app.use('/api/gradivo', gradivoApi);
app.use('/api/osebje', osebjeApi);
app.use('/api/moduli', moduliApi);
app.use('/api/iskanje', iskanjeApi);
app.use('/api/uporabniki', uporabnikiApi);
app.use('/api/db', bazaApi);


app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api/swagger.json", (req, res) => {
    res.status(200).json(swaggerDocument);
});

app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    res.render('error', {
        title: 'Stran na tem naslovu ne obstaja',
        error: ''
    });
});

// /api error handler
app.use('/api', function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.trace('[Application] ' + err);

    if (err.response) {
        res.status(err.response.status || 500);
    } else {
        res.status(err.status || 500);
    }

    if (res.statusCode == 404) {
        res.json('error', {
            sporocilo: 'Ta object ne obstaja'
        });
    } else if (res.statusCode < 500) {
        res.render('error', {
            sporocilo: 'Zgodila se je napaka v HTTP zahtevi',
            napaka: req.app.get('env') === 'development' ? err : ''
        });
    } else {
        res.render('error', {
            sporocilo: 'Interna napaka strežnika',
            napaka: req.app.get('env') === 'development' ? err : ''
        });
    }
});
app.use((err, req, res, next) => {
    if (err.name == "UnauthorizedError") {
        res.status(401).json({"sporočilo": err.name + ": " + err.message});
    }
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.trace('[Application] ' + err);

    // render the error page
    if (err.response) {
        res.status(err.response.status || 500);
    } else {
        res.status(err.status || 500);
    }

    if (res.statusCode == 404) {
        res.render('error', {
            title: 'Stran na tem naslovu ne obstaja',
            error: ''
        });
    } else if (res.statusCode < 500) {
        res.render('error', {
            title: 'Zgodila se je napaka v HTTP zahtevi',
            error: ''
        });
    } else {
        res.render('error', {
            title: 'Interna napaka strežnika',
            error: req.app.get('env') === 'development' ? err : ''
        });
    }

});

process.on('uncaughtException', (err) => {
    console.log('[Application] Uncaught exception: ' + err);
});

module.exports = app;