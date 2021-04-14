const router = require('express').Router();
const ctrlGradivo = require('../controllers/gradivoController');

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
 *  - name: Gradivo
 *    description: Delo z gradivom in komentarji
 */

/**
 * @swagger
 * /gradivo/{idGradiva}:
 *  get:
 *      summary: Pridobi želeno gradivo
 *      description: Pridobi želeno gradivo z podatki.
 *      tags: [Gradivo]
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *      responses:
 *          "200":
 *              description: Uspešno vrne želeno gradivo.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Gradivo"
 *          "404":
 *              description: Ne najdem gradiva, idOseba je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

/**
 * @swagger
 * /gradivo/{idGradiva}:
 *  delete:
 *      summary: Izbriši želeno gradivo
 *      description: Izbriši želeno gradivo z podatki.
 *      tags: [Gradivo]
 *      security:
 *          - jwt: []
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *      responses:
 *          "204":
 *              description: Uspešno izbrisano gradivo.
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "404":
 *              description: Ne najdem gradiva, idGradiva je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.route('/:idGradiva')
    .get(ctrlGradivo.pridobiGradivo)
    .delete(avtentikacija, ctrlGradivo.izbrisiGradivo);


/**
 * @swagger
 * /gradivo/{idGradiva}/komentar:
 *  post:
 *      summary: Dodaj komentar
 *      description: Dodajanje komentarja na želeno gradivo.
 *      tags: [Gradivo]
 *      security:
 *          - jwt: []
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Komentar"
 *      responses:
 *          "201":
 *              description: Uspešno objavljen komentar.
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "404":
 *              description: Ne najdem gradiva, idGradiva je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.post('/:idGradiva/komentar',
    avtentikacija,
    ctrlGradivo.objaviKomentar);


/**
 * @swagger
 * /gradivo/{idGradiva}/prijava:
 *  post:
 *      summary: Prijavi gradivo
 *      description: Prijavi gradivo za odstranitev.
 *      tags: [Gradivo]
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *      responses:
 *          "201":
 *              description: Uspešno prijavljeno gradivo.
 *          "404":
 *              description: Ne najdem gradiva, idGradiva je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.post('/:idGradiva/prijava',
    ctrlGradivo.prijaviGradivo);

/**
 * @swagger
 * /gradivo/{idGradiva}/preklopiVidljivost:
 *  post:
 *      summary: Preklopi vidljivost
 *      description: Preklopi vidljivost želenega gradiva.
 *      tags: [Gradivo]
 *      security:
 *          - jwt: []
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *      responses:
 *          "201":
 *              description: Uspešno spremenjena vidljivost gradiva.
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "403":
 *              description: Gradivo lahko nadzira samo administrator.
 *          "404":
 *              description: Ne najdem gradiva, idGradiva je obvezen parameter.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.post('/:idGradiva/preklopiVidljivost',
    avtentikacija,
    ctrlGradivo.preklopiVidljivostGradiva);

/**
 * @swagger
 * /gradivo/{idGradiva}/komentar/{idKomentar}:
 *  delete:
 *      summary: Izbriši komentar
 *      description: Izbriši želeno komentar.
 *      tags: [Gradivo]
 *      security:
 *          - jwt: []
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *        - in: path
 *          name: idKomentar
 *          description: Enolični identifikator komentarja
 *          schema:
 *            type: string
 *      responses:
 *          "204":
 *              description: Uspešno izbrisano gradivo.
 *          "401":
 *              description: Ne najdem uporabnika oz. ni administrator.
 *          "403":
 *              description: Komentarje lahko briše samo avtor ali administrator.
 *          "404":
 *              description: Ne najdem gradiva, idGradiva in idKomentar sta obvezena parametra.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.delete('/:idGradiva/komentar/:idKomentar',
    avtentikacija,
    ctrlGradivo.izbrisiKomentar);

/**
 * @swagger
 * /gradivo/{idGradiva}//komentar/{idKomentar}/prijava:
 *  post:
 *      summary: Prijavi gradivo
 *      description: Prijavi komentar za odstranitev.
 *      tags: [Gradivo]
 *      parameters:
 *        - in: path
 *          name: idGradiva
 *          description: Enolični identifikator gradiva
 *          schema:
 *            type: string
 *        - in: path
 *          name: idKomentar
 *          description: Enolični identifikator komentarja
 *          schema:
 *            type: string
 *      responses:
 *          "201":
 *              description: Uspešno prijavljeno gradivo.
 *          "404":
 *              description: Ta komentar ne obstaja.
 *          "500":
 *              description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

router.post('/:idGradiva/komentar/:idKomentar/prijava',
    ctrlGradivo.prijaviKomentar);



module.exports = router;