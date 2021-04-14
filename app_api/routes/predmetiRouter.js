const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const ctrlPredmeti = require('../controllers/predmetiController');
const ctrlGradivo = require('../controllers/gradivoController');

const jwt = require('express-jwt');
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: 'payload',
  algorithms: ['HS256']
});

const neobveznaAvtentikacija = jwt({
    secret: process.env.JWT_GESLO,
    userProperty: 'payload',
    algorithms: ['HS256'],
    credentialsRequired: false
  });

/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: Predmet
 *    description: Obvladovanje predmetov
 */

/**
 * @swagger
 *  /predmeti:
 *   get:
 *    summary: Seznam predmetov
 *    description: Pridobitev predmetov iz podatkovne baze
 *    tags: [Predmet]
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom  najdenih predmetov v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *          type: array
 *          items:
 *           $ref: "#/components/schemas/Predmet"
 *     "404":
 *      description: Napaka pri pridobivanju predmetov.
 */

router.get('/',
    ctrlPredmeti.predmetiPridobi);

/**
 * @swagger
 *  /predmeti/{predmetId}:
 *   get:
 *    summary: Podrobnosti izbranega predmeta
 *    description: Pridobitev izbranega predmeta iz podatkovne baze
 *    tags: [Predmet]
 *    parameters:
 *     - in: path
 *       name: predmetId
 *       description: enolični identifikator predmeta
 *       schema:
 *        type: string
 *       required: true
 *       example: 5fead389f5f0ec2aece95d9c
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s podrobnostmi izbranega predmeta v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *          type: array
 *          items:
 *           $ref: "#/components/schemas/Predmet"
 *     "404":
 *      description: Ta predmet ne obstaja.
 */

router.get('/:predmetId',
    neobveznaAvtentikacija, ctrlPredmeti.predmetiPridobiById);

/**
 * @swagger
 *  /predmeti:
 *   post:
 *    summary: Dodajanje novega predmeta
 *    description: Dodajanje **novega predmeta** z imenom, opisom, letnikom, semestrom, seznamom profesorjev in asistentov.
 *    tags: [Predmet]
 *    security:
 *     - jwt: []
 *    requestBody:
 *     description: Podatki o predmetu
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        $ref: "#/components/schemas/Predmet"
 *    responses:
 *     "201":
 *      description: Uspešno dodan predmet, ki se vrne v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Predmet"
 *     "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *     "400":
 *      description: Napaka pri shranjevanju predmeta.
 *     "500":
 *      description: Napaka na strežniku.
 */

router.post('/',
    avtentikacija, ctrlPredmeti.predmetiDodaj);

// odkomentiraj in preimenuj ko je implementirano

/**
 * @swagger
 *  /predmeti/{idPredmet}:
 *   put:
 *    summary: Posodabljanje izbranega predmeta
 *    description: Posodobitev **podrobnosti izbranega predmeta** z imenom, opisom, letnikom, semestrom, seznamom profesorjev in asistentov.
 *    tags: [Predmet]
 *    security:
 *     - jwt: []
 *    requestBody:
 *     description: Podatki o predmetu
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        $ref: "#/components/schemas/Predmet"
 *    parameters:
 *     - in: path
 *       name: idPredmet
 *       description: enolični identifikator predmeta
 *       schema:
 *        type: string
 *       required: true
 *    responses:
 *     "200":
 *      description: Uspešno posodobljen predmet, ki se vrne v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Predmet"
 *     "401":
 *      description: Napaka pri dostopu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ni zetona:
 *          $ref: "#/components/examples/NiZetona"
 *     "404":
 *      description: Napaka zahteve pri ažuriranju predmeta
 *     "500":
 *      description: Napaka pri dostopu do podatkovne baze.
 */

router.put('/:idPredmet',
    avtentikacija, ctrlPredmeti.predmetiPosodobi);

/**
 * @swagger
 *  /predmeti/{idPredmet}:
 *   delete:
 *    summary: Brisanje izbranega predmeta
 *    description: Brisanje **izbranega predmeta**.
 *    tags: [Predmet]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idPredmet
 *       description: enolični identifikator predmeta
 *       schema:
 *        type: string
 *       required: true
 *    responses:
 *     "204":
 *      description: Uspešno izbrisan predmet.
 *     "404":
 *      description: Napaka zahteve, zahtevanega predmeta ni mogoče najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ne najdem predmeta:
 *          $ref: "#/components/examples/NeNajdemPredmeta"
 *     "401":
 *      description: Napaka pri dostopu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ni zetona:
 *          $ref: "#/components/examples/NiZetona"
 *     "500":
 *      description: Napaka pri brisanju predmeta.
 */

router.delete('/:idPredmet',
    avtentikacija, ctrlPredmeti.predmetiIzbrisi);

/**
 * @swagger
 *  /predmeti/{idPredmet}/gradivo:
 *   post:
 *    summary: Dodajanje gradiva izbranemu predmetu
 *    description: Dodajanje **gradiva** s podatki o predmetu, imenu, številom prijav, povezavo, vidnostjo **izbranemu predmetu** s podanim enoličnim identifikatorjem.
 *    tags: [Predmet]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idPredmet
 *       description: enolični identifikator predmeta
 *       schema:
 *        type: string
 *       required: true
 *       example: 5ded18eb51386c3799833191
 *    requestBody:
 *     description: Podatki o gradivu
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        $ref: "#/components/schemas/Gradivo"
 *    responses:
 *     "201":
 *      description: Uspešno dodano gradivo, ki se vrne v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Gradivo"
 *     "400":
 *      description: Napaka pri shranjevanju gradiva.
 *     "401":
 *      description: Napaka pri dostopu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ni zetona:
 *          $ref: "#/components/examples/NiZetona"
 *     "404":
 *      description: Napaka zahteve, zahtevanega predmeta ni mogoče najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ne najdem gradiva:
 *          $ref: "#/components/examples/NeNajdemGradiva"
 */

router.post('/:idPredmeta/gradivo',
    avtentikacija,
    upload.single('datoteka'),
    ctrlGradivo.naloziGradivo);

module.exports = router;