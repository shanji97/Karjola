const router = require('express').Router();
const ctrlBaza = require('../controllers/bazaController');

const jwt = require('express-jwt');
const avtentikacija = jwt({
    secret: process.env.JWT_GESLO,
    userProperty: 'payload',
    algorithms: ['HS256']
});

/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: VnosBaze
 *    description: Vnašanje podatkov v podatkovno bazo.
 *
 */

/**
 * Varnostna shema dostopa
 * @swagger
 * components:
 *  securitySchemes:
 *   jwt:
 *    type: http
 *    scheme: bearer
 *    in: header
 *    bearerFormat: JWT
 */
router.route("/")
/**
* @swagger
 * /db:
 *  post:
 *   summary: Vnos začetnih podatkov v bazo
 *   description: Vnos začetnih podatkov v bazo
 *   requestBody:
 *    required: false
 *   tags: [VnosBaze]
 *   responses:
 *    "201":
 *      description: Uspešna zahteva s seznamom  najdenih uporabnikov v rezultatu.
 *    "404":
 *      description: Podatki, ki bi morali biti uvoženi v bazo ne obstajajo.
 *    "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */
    .post(ctrlBaza.vnosBaze)

/**
* @swagger
 * /db:
 *  delete:
 *   security:
 *     - jwt: []
 *   summary: Vnos začetnih podatkov v bazo
 *   description: Vnos začetnih podatkov v bazo
 *   requestBody:
 *    required: false
 *   tags: [VnosBaze]
 *   responses:
 *    "204":
 *     description: Uspešna zahteva s seznamom  najdenih uporabnikov v rezultatu.
 *    "401":
 *     description: Napaka pri dostopu. Dostop ima le admininistrator.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/Napaka"
 *       examples:
 *        ni zetona:
 *         $ref: "#/components/examples/NiZetona"
 *    "404":
 *      description: Uporabnik, ki izvaja opreracijo, v bazi ne obstaja
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ne najdem uporabnika:
 *          $ref: "#/components/examples/NeNajdemUporabnika"     
 *    "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */
    .delete(avtentikacija,ctrlBaza.izbrisBaze);
module.exports = router;