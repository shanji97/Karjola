const mongoose = require('mongoose');


/**
 * @swagger
 *  components:
 *    schemas:
 *      Osebje:
 *        type: object
 *        properties:
 *          akademskiNaziv:
 *            type: string
 *            example: docent
 *          izobrazba:
 *            type: string
 *            example:
 *          ime_priimek:
 *            type: string
 *            example: Dejan Lavbič
 *          e_mail:
 *            type: string
 *            example:
 *          opis: 
 *            type: string
 *            example: Profesor pri Spletnem programiranju in Osnovah informacijskih sistemov
 *        required:
 *          - ime_priimek
 *          - opis
 */
const osebjeShema = new mongoose.Schema({
  akademskiNaziv: {type: String},
  izobrazba: {type: String},
  ime_priimek: {type: String, required: true},
  e_mail: {type: String},
  opis: {type: String, required: true}
});

mongoose.model('Osebje', osebjeShema, 'osebje');
