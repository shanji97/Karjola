const mongoose = require('mongoose');
const Osebje = require('./osebje.js');

/**
 * @swagger
 * components:
 *  schemas:
 *   Modul:
 *    type: object
 *    properties:
 *     ime:
 *      type: string
 *      example: Umetna inteligenca
 *    required:
 *     - ime
 */

const modulShema = new mongoose.Schema({
  ime: {type: String, required: true}
});

/**
 * @swagger
 * components:
 *  schemas:
 *   Komentar:
 *    type: object
 *    properties:
 *     gradivo:
 *      type: string
 *      format: uuid
 *      $ref: "#/components/schemas/Gradivo"
 *     predmet:
 *      type: string
 *      format: uuid
 *      $ref: "#/components/schemas/Predmet"
 *     avtor:
 *      type: string
 *      format: uuid
 *      $ref: "#/components/schemas/Uporabnik"
 *     datum:
 *      type: string
 *      format: date
 *      example: 2021-01-03
 *     anonimnost:
 *      type: boolean
 *      example: true
 *     stPrijav:
 *      type: number
 *      example: 10
 *     besedilo:
 *      type: string
 *      example: To je besedilo komentarja.
 *    required:
 *      - gradivo
 *      - predmet
 *      - avtor
 *      - anonimnost
 *      - besedilo
 */

const komentarjiShema = new mongoose.Schema({
  gradivo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gradivo',
    required: true
  },
  predmet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Predmet',
    required: true
  },
  avtor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Uporabnik', 
    required: true
  },
  datum: {type: Date, "default": Date.now},
  anonimnost: {type: Boolean, required: true},
  stPrijav: {type: Number, min: 0, default: 0},
  besedilo: {type: String, required: true}
});

/**
 * @swagger
 * components:
 *  schemas:
 *   Gradivo:
 *    type: object
 *    properties:
 *     predmet:
 *      type: string
 *      format: uuid
 *      $ref: "#/components/schemas/Predmet"
 *     avtor:
 *      type: string
 *      format: uuid
 *     vidno:
 *      type: boolean
 *      example: true
 *     stPrijav:
 *      type: number
 *      minimum: 0
 *     isFile:
 *      type: boolean
 *     datoteka:
 *      type: object
 *      properties:
 *        ime:
 *          type: string
 *        data:
 *          type: string
 *        contentType:
 *          type: string
 *     povezava:
 *      type: string
 *     komentarji:
 *      type: array
 *      items:
 *        type: string
 *        $ref: "#/components/schemas/Komentar"
 *    required:
 *     - predmet
 *     - vidno
 *     - isFile
 */

const gradivoShema = new mongoose.Schema({
  predmet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Predmet',
    required: true
  },
  avtor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Uporabnik',
  },
  vidno: {type: Boolean, default: true},
  stPrijav: {type: Number, min: 0, default: 0},
  // True -> dejanski file , False -> link
  isFile: {type: Boolean, required: true},
  datoteka: {ime: String, data: Buffer, contentType: String},
  povezava: {type: String},
  komentarji: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Komentar'}]
});

/**
 * @swagger
 * components:
 *  schemas:
 *   Predmet:
 *    type: object
 *    properties:
 *     ime:
 *      type: string
 *      example: Spletno programiranje
 *     opis:
 *      type: string
 *      example: To je opis predmeta.
 *     letnik:
 *      type: number
 *      example: 1
 *     semester:
 *      type: number
 *      example: 1
 *     profesorji:
 *      type: array
 *      items:
 *        type: string
 *        format: uuid
 *        $ref: "#/components/schemas/Osebje"
 *     asistenti:
 *      type: array
 *      items:
 *        type: string
 *        $ref: "#/components/schemas/Osebje"
 *     moduli:
 *      type: array
 *      items:
 *        type: string
 *        $ref: "#/components/schemas/Modul"
 *     vrstaIzbirnega:
 *      type: number
 *     gradiva:
 *      type: array
 *      items:
 *        type: string
 *        format: uuid
 *        $ref: "#/components/schemas/Gradivo"
 */

const predmetShema = new mongoose.Schema({
  ime: {type: String, unique: true},
  opis: {type: String},
  // 0 -> ni v letniku a, 1 -> 1. letnik...
  letnik: {type: Number},
  // 1 -> 1.semester...
  semester: {type: Number},
  profesorji : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Osebje'
  }],
  asistenti: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Osebje'
  }], 
  moduli: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modul'
  }],
  // 0 -> ni izbirni, 1 -> splošni, 2 -> strokovni
  vrstaIzbirnega: {type: Number},
  gradiva: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gradivo'
  }],
  kraticaPredmeta:{type: String, unique:true}
});

/**
 * @swagger
 *  components:
 *   examples:
 *    NeNajdemPredmeta:
 *     summary: ne najdem predmeta
 *     value:
 *      sporočilo: Ne najdem predmeta.
 *    NeNajdemGradiva:
 *     summary: ne najdem gradiva
 *     value:
 *      sporočilo: Ne najdem gradiva.
 */



mongoose.model('Predmet', predmetShema, 'predmeti');
mongoose.model('Modul', modulShema, 'moduli');
mongoose.model('Gradivo', gradivoShema, 'gradiva');
mongoose.model('Komentar', komentarjiShema, 'komentarji');
