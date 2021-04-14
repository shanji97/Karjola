var router = require('express').Router();
var iskanjeCtrl = require('../controllers/iskanjeController');

/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: Iskanje
 *    description: Iskanje po osebju, gradivu, predmetih
 */

/**
 * @swagger
 * /iskanje/{iskalniIzraz}:
 *  get:
 *      summary: Iskanje zadetkov
 *      description: Pridobi rezultate iskanja osebja, gradiva, predmetov glede na iskalni niz.
 *      tags: [Iskanje]
 *      parameters:
 *        - in: path
 *          name: iskalniIzraz
 *          description: Iskalni niz 
 *          schema:
 *            type: string
 * 
 *      responses:
 *          "200":
 *              description: Uspešno vrne seznam osebja.
 *              content:
 *                  application/json:
 *                      schema:
 *                          anyOf:
 *                              - $ref: "#/components/schemas/Osebje"
 *                              - $ref: "#/components/schemas/Gradivo"
 *                              - $ref: "#/components/schemas/Predmet"
 *          "404":
 *              description: Seznama osebja ni mogoče najti.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.get('/', iskanjeCtrl.iskanje);

module.exports = router;