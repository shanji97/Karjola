var router = require('express').Router();
const ctrlOsebje = require('../controllers/osebjeController');

/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: Osebje
 *    description: Urejanje osebja
 */

const jwt = require('express-jwt');
const avtentikacija = jwt({
    secret: process.env.JWT_GESLO,
    userProperty: 'payload',
    algorithms: ['HS256']
});


/**
 * @swagger
 * /osebje:
 *  get:
 *      summary: Pridobi seznam osebja
 *      description: Pridobi seznam osebja z podatki.
 *      tags: [Osebje]
 *      responses:
 *          "200":
 *              description: Uspešno vrne seznam osebja.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Osebje"
 *          "404":
 *              description: Seznama osebja ni mogoče najti.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

/**
 * @swagger
 * /osebje:
 *  post:
 *      summary: Doda osebo
 *      description: Dodaj želeno osebo osebja.
 *      security:
 *          - jwt: []
 *      tags: [Osebje]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Osebje"
 *      responses:
 *          "201":
 *              description: Uspešno dodana oseba.
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "409":
 *              description: Oseba že obstaja.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
/**
 * @swagger
 * /osebje/{idOsebja}:
 *  put:
 *      summary: Posodobi želeno osebje
 *      description: Posodobi osebo z podatki.
 *      tags: [Osebje]
 *      security:
 *          - jwt: []
 *      parameters:
 *          - in: path
 *            name: idOseba
 *            description: Enolični identifikator osebja
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          "200":
 *              description: Uspešno posodobi izbrano osebo.
 *              content:
 *               application/json:
 *                   schema:
 *                      $ref: "#/components/schemas/Osebje"
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "404":
 *              description: Ne najdem osebe, idOseba je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
 /**
 * @swagger 
 * /osebje/{idOseba}:
 *  delete:
 *      summary: Izbriši osebo
 *      description: Izbriši želeno osebo.
 *      tags: [Osebje]
 *      security:
 *          - jwt: []
 *      parameters:
 *          - in: path
 *            name: idOseba
 *            description: Enolični identifikator osebja
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          "204":
 *              description: Uspešno vrne izbrano osebo.
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "404":
 *              description: Ne najdem osebe, idOseba je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
 
router.route('/')
    .get(ctrlOsebje.osebjePridobi)
    .post(avtentikacija, ctrlOsebje.osebjeDodaj);

router.route('/:idOseba')
    .put(avtentikacija, ctrlOsebje.osebjePosodobi)
    .delete(avtentikacija, ctrlOsebje.osebjeIzbrisi);

module.exports = router;