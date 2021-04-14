var router = require('express').Router();
const ctrlModuli = require('../controllers/moduliController');

const jwt = require('express-jwt');
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: 'payload',
  algorithms: ['HS256']
});
/**
 * @swagger
 *  components:
 *   schemas:
 *    ModulPovzetek:
 *     type: object
 *     properties:
 *      _id:
 *       type: string
 *       format: uuid
 *       description: Enolični identifikator modula
 *       example: 5ded18eb51386c3799833191
 *      ime:
 *       type: string
 *       description: Ime samega modula
 *       example: Razvoj programske opreme 
 */

/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: Modul
 *    description: Operacije z moduli
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
router.route('/')
/**
* @swagger
 *  /moduli:
 *   get:
 *    summary: Seznam modulov
 *    description: Pridobitev javnih podatkov modulov iz podatkovne baze
 *    tags: [Modul]
 *    responses:
 *     "200":
 *      descritption: Uspešna zahteva s seznamom  najdenih modulov v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *          type: array
 *          items:
 *           $ref: "#/components/schemas/ModulPovzetek"
 *     "404":
 *      descritption: Ni modulov v podatkovni bazi
 *      content:
 *       application/json:
 *        schema:
 *          items:
 *           $ref: "#/components/schemas/NapakaModula"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */
        .get(ctrlModuli.moduliPridobi)
/**
* @swagger
 *  /moduli:
 *   post:
 *    summary: Kreiranje modula
 *    description: Kreiranje modula in vnos v podatkovno bazo
 *    tags: [Modul]
 *    security:
 *     - jwt: []
 *    requestBody:
 *     description: Podatki za kreiranje modula
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        $ref: "#/components/schemas/ModulPovzetek"
 *    responses:
 *     "201":
 *      descritption: Uspešna zahteva pri kreiranju modula
 *      content:
 *       application/json:
 *        schema:
 *          items:
 *           $ref: "#/components/schemas/ModulPovzetek"
 *     "401":
 *       description: Ni prisotna avtorizacija.
 *       content:
 *        application/json:
 *         schema:
 *          $ref: "#/components/schemas/NapakaAvtentikacije"
 *         example:
 *          sporočilo: "Dodaj veljaven JWT žeton."
 *     "400":
 *      descritption: Ni podanega imena za ime modula
 *      content:
 *       application/json:
 *        schema:
 *           $ref: "#/components/schemas/NapakaModulaNiImena"
 *        example:
 *         sporočilo: "Ni podano ime modula ali je napačnega formata."
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */
        .post(avtentikacija,ctrlModuli.moduliDodaj);
        
router.route('/:idModula')
/**
* @swagger
 *  /moduli/{idModula}:
 *   put:
 *    summary: Posodabljanje modula
 *    description: Posodabljanje modula v podatkovni bazi
 *    tags: [Modul]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idModula
 *       description: enolični identifikator modula
 *       required: true
 *       schema:
 *        type: string
 *    requestBody:
 *     description: Podatki za posodabljanje modula
 *     required: true
 *     content:
 *      application/x-www-form-urlencoded:
 *       schema:
 *        $ref: "#/components/schemas/ModulPovzetek"
 *    responses:
 *     "200":
 *      descritption: Uspešna zahteva pri kreiranju modula
 *      content:
 *       application/json:
 *        schema:
 *          items:
 *           $ref: "#/components/schemas/ModulPovzetek"
 *     "401":
 *       description: Ni prisotna avtorizacija.
 *       content:
 *        application/json:
 *         schema:
 *          $ref: "#/components/schemas/NapakaAvtentikacije"
 *         example:
 *          sporočilo: "Dodaj veljaven JWT žeton."
 *     "404":
 *      descritption: Modula z posanim enoličnim identifikatorjem ne najdem
 *      content:
 *       application/json:
 *        schema:
 *          items:
 *           $ref: "#/components/schemas/NapakaModula"
 *     "400":
 *      descritption: Ni podanega imena za ime ali 
 *      content:
 *       application/json:
 *        schema:
 *           $ref: "#/components/schemas/NapakaModulaNiImena"
 *        example:
 *         sporočilo: "Ni podano ime modula ali je napačnega formata."
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */

        .put(avtentikacija,ctrlModuli.moduliPosodobi)
/**
* @swagger
 *  /moduli/{idModula}:
 *   delete:
 *    summary: Brisanje modula
 *    description: Brisanje modula v podatkovni bazi
 *    tags: [Modul]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idModula
 *       description: enolični identifikator modula
 *       required: true
 *       schema:
 *        type: string
 *    responses:
 *     "204":
 *      descritption: Uspešna zahteva pri brisanje modula
 *     "401":
 *       description: Ni prisotna avtorizacija.
 *       content:
 *        application/json:
 *         schema:
 *          $ref: "#/components/schemas/NapakaAvtentikacije"
 *         example:
 *          sporočilo: "Dodaj veljaven JWT žeton."
 *     "404":
 *      descritption: Modula z posanim enoličnim identifikatorjem ne najdem
 *      content:
 *       application/json:
 *        schema:
 *          items:
 *           $ref: "#/components/schemas/NapakaModula"
 *     "400":
 *      descritption: Ni podanega imena za ime ali 
 *      content:
 *       application/json:
 *        schema:
 *           $ref: "#/components/schemas/NapakaModulaNiImena"
 *        example:
 *         sporočilo: "Ni podano ime modula ali je napačnega formata."
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */

        .delete(avtentikacija,ctrlModuli.moduliIzbrisi);

module.exports = router;