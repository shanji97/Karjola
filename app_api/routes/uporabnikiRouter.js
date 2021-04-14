var router = require('express').Router();

const jwt = require('express-jwt');
const avtentikacija = jwt({
    secret: process.env.JWT_GESLO,
    userProperty: 'payload',
    algorithms: ['HS256']
});


 
const ctrlUporabniki  = require("../controllers/uporabnikiController");
/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: Uporabnik
 *    description: Prikaz uporabnikov
 *  - name: Avtentikacija
 *    description: Avtentikacija
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

/*Uporabnik*/ 
router.route("/")
/**
* @swagger
 *  /uporabniki:
 *   get:
 *    summary: Seznam uporabnikov
 *    description: Pridobitev javnih podatkov uporabnikov iz podatkovne baze
 *    tags: [Uporabnik]
 *    responses:
 *     "200":
 *      descritption: Uspešna zahteva s seznamom  najdenih uporabnikov v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *          type: array
 *          items:
 *           $ref: "#/components/schemas/UporabnikiBranjePovzetek"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.     
 */
       .get(ctrlUporabniki.prikazi); 

router.route("/:idUporabnika")
/**
 * @swagger
 *  /uporabniki/{idUporabnika}:
 *   get:
 *    summary: Podrobnost izbranega uporabnika
 *    description: Pridobitev **podrobnosti izbranega uporabnika** s podatki - identifikator, uporabniško ime, e-pošta, žeton za obnavljanje gesla, ali je administrator, naključna vrednost, naslov, pošta ter kraj. 
 *    tags: [Uporabnik]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idUporabnika
 *       description: enolični identifikator uporabnika
 *       schema:
 *        type: string
 *       required: true
 *       example: 5ded18eb51386c3799833191
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s podrobnostmi zahtevanega uporabnika v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *          $ref: "#/components/schemas/UporabnikBranjePovzetek"
 *     "400":
 *      description: Ni podanega parametra idUporabnika oziroma je ta napačnega formata.
 *     "401":
 *      description: Ne najdem uporabnika oz. ni administrator.
 *     "404":
 *      description: Napaka zahteve, zahtevanega uporabnika ni mogoče najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ne najdem uporabnika:
 *          $ref: "#/components/examples/NeNajdemUporabnika"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
      .get(avtentikacija,ctrlUporabniki.preberiIzbranega)//DELETE 400,404, 500, 204
/**
 * @swagger
 *  /uporabniki/{idUporabnika}:
 *   delete:
 *    summary: Brisanje izbranega uporabnika
 *    description: Brisanje **izbranega uporabnika**.
 *    tags: [Uporabnik]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idUporabnika
 *       description: enolični identifikator uporabnika
 *       schema:
 *        type: string
 *       required: true
 *    responses:
 *     "204":
 *      description: Uspešno izbrisan uporabnik.
 *     "404":
 *      description: Napaka zahteve, zahtevanega uporabnika ni mogoče najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ne najdem uporabnika:
 *          $ref: "#/components/examples/NeNajdemUporabnika"
 *     "401":
 *      description: Napaka pri dostopu. Dostop ima le admin.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ni zetona:
 *          $ref: "#/components/examples/NiZetona"
 *     "500":
 *      description: Napaka pri brisanju uporabnika.
 */
      .delete(avtentikacija,ctrlUporabniki.izbrisiIzbranega); //ok
 /**
 * @swagger
 *   /uporabniki/prijava:
 *     post:
 *       summary: Prijava obstoječega uporabnika
 *       description: Prijava **obstoječega uporabnika** s študentskim elektronskim naslovom in geslom.
 *       tags: [Avtentikacija]
 *       requestBody:
 *         description: Prijavni podatki
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/UporabnikPrijava"
 *       responses:
 *         "200":
 *           description: Uspešna prijava uporabnika z JWT žetonom v rezultatu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *               example:
 *                žeton: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdiI6ImRlamFuQGxhdmJpYy5uZXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBAs
 *         "400":
 *           description: Napaka zahteve, pri prijavi sta študentski elektorniski naslov in geslo.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Vsaj en parameter (epošta ali geslo) manjka. Podana moreta biti oba parametra brez HTML značk!
 *         "401":
 *           description: Napaka pri prijavi uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               examples:
 *                 ePosta:
 *                   value:
 *                     sporočilo: Uporabnik ni posredoval pravilno kombinacijo študentskega maila in gesla.
 *                   summary: Uporabnik ni posredoval pravilno kombinacijo študentskega maila in gesla.
 *                 geslo:
 *                   value:
 *                     sporočilo: Uporabnik ni posredoval pravilno kombinacijo študentskega maila in gesla.
 *                   summary: Uporabnik ni posredoval pravilno kombinacijo študentskega maila in gesla.
 *         "500":
 *           description: Napaka na strežniku pri preverjanju uporabnika.
 */
router.post("/prijava",ctrlUporabniki.pridobiPrijavnePodatkeUporabnika); //ok
/**
 * @swagger
 *   /uporabniki/registriraj:
 *     post:
 *       summary: Registracija novega uporabnika
 *       description: Registracija **novega uporabnika** s podatki o imenu, elektronskem naslovu in geslu.
 *       tags: [Avtentikacija]
 *       requestBody:
 *         description: Podatki za registracijo
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/UporabnikRegistracija"
 *       responses:
 *         "201":
 *           description: Uspešna registracija uporabnika z JWT žetonom v rezultatu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *               example:
 *                žeton: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdiI6ImRlamFuQGxhdmJpYy5uZXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBAs
 *         "400":
 *           description: Napaka zahteve, pri registraciji so obvezni uporabniško ime, geslo ter potrditev gesla, študentski e-poštni naslov, naslov in kraj bivanja vključno s poštno številko.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *             example:
 *               sporočilo: Zahtevani so vsi podatki.
 *         "500":
 *           description: Napaka na strežniku pri rprijavi uporabnika.
 */
router.post("/registriraj",ctrlUporabniki.registrirajUporabnika);  //ok
/**
 * @swagger
 *   /uporabniki/{idUporabnika}/posodobiGeslo:
 *     put:
 *      summary: Vnos novega uporabniškega gesla, če uporabnik to želi
 *      description: Vnos novega uporabniškega gesla, če prijavljen uporabnik to želi
 *      tags: [Uporabnik]
 *      security:
 *       - jwt: []
 *      parameters:
 *       - in: path
 *         name: idUporabnika
 *         description: enolični identifikator uporabnika
 *         required: true
 *         schema:
 *          type: string
 *      requestBody:
 *       description: Staro geslo, novo geslo in ponovitev novega gesla - Geslo za registracijo uporabnika. Vnesti je potrebno 8 znakov. Od teh mora biti najmanj ena velika in ena manjhna črka, geslo pa more vsebovati še minimalno eno številko in en poseben znak iz nabora #$€
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *         schema:
 *          $ref: "#/components/schemas/UporabnikPosodobitevGesla"
 *      responses:
 *        "200":
 *          description: Uspešna posodobitev gesla uporabnika
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Uspesno"
 *              example:
 *               sporočilo: Geslo uspešno posodobljeno!
 *        "401":
 *          description: Ni prisotna avotirizacija
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/NapakaAvtentikacije"
 *            example:
 *              sporočilo: "Dodaj veljaven JWT žeton."
 *        "404":
 *          description: Uporabnik s tem enoličnim identifikatorjem ne obstaja
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporočilo: Če misliš, da bi moral biti registriran vprašaj osebje, če si res.
 *        "400":
 *          description: Napaka zahteve, staro geslo ne ustreza shranjenemu geslu v bazi in gesla ne ustrezajo kriterijem - Geslo mora ustrezati naslednjim kriterijem -> Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!
 *          content:
 *           application/json:
 *            schema:
 *             $ref: "#/components/schemas/Napaka"
 *            example:
 *             sporočilo: Zahtevan je študentski e-poštni naslov (FRI) UL. Geslo mora ustrezati naslednjim kriterijem -> Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!
 *        "500":
 *          description: Napaka na strežniku pri obnovi gesla uporabnika.
 */


router.put("/:idUporabnika/posodobiGeslo",avtentikacija,ctrlUporabniki.posodobiGeslo); //ok

/**
 * @swagger
 *   /uporabniki/vnosZetona:
 *     put:
 *      summary: Vnos žeton za uporabnika, ki je registriran, je pa pozabil geslo
 *      description: Uporabnik, ki je pozabil geslo vnese svoj mail in na svoj mail pridobi žeton, ga katere vnese kasneje pri obnovi gesla
 *      tags: [Uporabnik]
 *      requestBody:
 *       description: Novo geslo in ponovitev novega gesla - Geslo za registracijo uporabnika. Vnesti je potrebno 8 znakov. Od teh mora biti najmanj ena velika in ena manjhna črka, geslo pa more vsebovati še minimalno eno številko in en poseben znak iz nabora #$€
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *         schema:
 *          $ref: "#/components/schemas/UporabnikVnosZetona"
 *      responses:
 *       "200":
 *           description: Uspešna obnovitev gesla uporabnika
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Uspesno"
 *               example:
 *                sporočilo: Geslo uspešno obnovljeno!
 *       "404":
 *          description: Uporabnik s tem študentskim mailom ne obstaja.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporočilo: Če misliš, da bi moral biti registriran vprašaj osebje, če si res.
 *       "400":
 *          description: Napaka zahteve, obvezen je **e-poštni naslov študenta (FRI) UL** ali geslo ne ustreza kriterijem - Geslo mora ustrezati naslednjim kriterijem -> Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!
 *          content:
 *           application/json:
 *            schema:
 *             $ref: "#/components/schemas/Napaka"
 *            example:
 *             sporočilo: Zahtevan je študentski e-poštni naslov (FRI) UL. Geslo mora ustrezati naslednjim kriterijem -> Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!
 *       "500":
 *          description: Napaka na strežniku pri obnovi gesla uporabnika.
 */

router.put("/vnosZetona", ctrlUporabniki.vnosZetona); //ok
/**
 * @swagger
 *   /uporabniki/obnovitevGesla:
 *     put:
 *      summary: Vnos žeton za uporabnika, ki je registriran, je pa pozabil geslo
 *      description: Uporabnik, ki je pozabil geslo vnese svoj mail in na svoj mail pridobi žeton, ga katere vnese kasneje pri obnovi gesla
 *      tags: [Uporabnik]
 *      requestBody:
 *       description: Novo geslo in ponovitev novega gesla - Geslo za registracijo uporabnika. Vnesti je potrebno 8 znakov. Od teh mora biti najmanj ena velika in ena manjhna črka, geslo pa more vsebovati še minimalno eno številko in en poseben znak iz nabora #$€
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *         schema:
 *          $ref: "#/components/schemas/UporabnikVnosZetona"
 *      responses:
 *       "200":
 *           description: Uspešna obnovitev gesla uporabnika
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Uspesno"
 *               example:
 *                sporočilo: Geslo uspešno obnovljeno!
 *       "404":
 *          description: Uporabnik s tem študentskim mailom ne obstaja.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporočilo: Če misliš, da bi moral biti registriran vprašaj osebje, če si res.
 *       "400":
 *          description: Napaka zahteve, obvezen je **e-poštni naslov študenta (FRI) UL** ali geslo ne ustreza kriterijem - Geslo mora ustrezati naslednjim kriterijem -> Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!
 *          content:
 *           application/json:
 *            schema:
 *             $ref: "#/components/schemas/Napaka"
 *            example:
 *             sporočilo: Zahtevan je študentski e-poštni naslov (FRI) UL. Geslo mora ustrezati naslednjim kriterijem -> Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov. Prav tako poskrbi, da bo v obe polji vpisano isto geslo!
 *       "500":
 *          description: Napaka na strežniku pri obnovi gesla uporabnika.
 */
router.put("/obnovitevGesla", ctrlUporabniki.obnoviGeslo); //ok

module.exports = router;