/**
 * @swagger
 *  components:
 *   examples:
 *    NiZetona:
 *     summary: ni JWT žetona
 *     value:
 *      sporočilo: "UnauthorizedError: No authorization token was found."
 *    VsiPodatki:
 *     summary: zahtevani so vsi podatki
 *     value:
 *      sporočilo: Zahtevani so vsi podatki.
 *    EMailNiUstrezen:
 *     summary: elektronski naslov ni ustrezen
 *     value:
 *      sporočilo: Elektronski naslov ni ustrezen!
 *    NeNajdemUporabnika:
 *     summary: uporabnika ne najdem v bazi
 *     value:
 *      sporočilo: Uporabnika ne najdem v bazi
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   UporabnikBranjePovzetek:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      format: uuid
 *      description: Enolični identifikator uporabnika
 *      example: 5ded18eb51386c3799833191
 *     uporabniskoIme:
 *      type: string
 *      description: Uporabniško ime uporabnika
 *      example: SomeRandomUs3rn4me
 *     ePosta:
 *      type: string
 *      description: Elektronski naslov uporabnika (študenta UL) za prijavo
 *      example: ak3900@student.uni-lj.si
 *     zetonZaObnavljanjeGesla:
 *      type: string
 *      description: Žeton za obnavljanje gesla (šifriran z naključno vrednostjo)
 *      example: d998873f5625a49bd220dc391e1726317ef754ffb92524c8757617db2b965dc3e5f8ab90938ea12e89dc9c045474086a379cacca079f1051126c4208389c1e2e
 *     jeAdmin:
 *      type: boolean
 *      description: Zastavica ali je uporabnik administrator ali ne
 *      example: false
 *     nakljucnaVrednost:
 *      type: string
 *      description: Naključna vrednost s pomočjo katere se šifrira geslo in žeton za obnovitev gesla
 *      example: 646c7a341a8e35f4bfa7e1fbc3b3b270
 *     zgoscenaVrednost:
 *      type: string
 *      description: Naključna vrednost s pomočjo katere se šifrira geslo in žeton za obnovitev gesla
 *      example: f4480dea97af653c7004b2d6a469878a2738ec1a3e146c30d150397dd27990a6ae592dc440bf7c2adc60373183229e2f3bdabd2de9b233983e7cb9b438462b50
 *     naslov:
 *      type: string
 *      description: Ulica in hišna številka uporabnika
 *      example: Gornja ulica 12
 *     posta:
 *      type: integer
 *      description: Številka pošte od občine v katerem na bi uporabnik živel
 *      example: 9220
 *     kraj:
 *      type: string
 *      description: Kraj (občina uporabnika)
 *      example: Lendava/Lendva
 *   UporabnikiBranjePovzetek:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      format: uuid
 *      description: Enolični identifikator uporabnika
 *      example: 5ded18eb51386c3799833191
 *     uporabniskoIme:
 *      type: string
 *      description: Uporabniško ime uporabnika
 *      example: SomeRandomUs3rn4me
 *     ePosta:
 *      type: string
 *      description: Elektronski naslov uporabnika (študenta UL) za prijavo
 *      example: ak3900@student.uni-lj.si
 *     jeAdmin:
 *      type: boolean
 *      description: Zastavica ali je uporabnik administrator ali ne
 *      example: false
 *     posta:
 *      type: integer
 *      description: Številka pošte od občine v katerem na bi uporabnik živel
 *      example: 9220
 *     kraj:
 *      type: string
 *      description: Kraj (občina uporabnika) 
 *      example: Lendava/Lendva
 *   UporabnikPrijava:
 *    type: object
 *    description: Podatki za prijavo uporabnika v aplikacijo Karjola
 *    properties:
 *     ePosta:
 *      type: string
 *      description: Elektronski naslov uporabnika (študenta UL) za prijavo
 *      example: ea3900@student.uni-lj.si
 *     geslo:
 *      type: string
 *      format: password
 *      description: Geslo za prijavo uporabnika
 *      example: eXpress12#S2M
 *    required:
 *     -ePosta
 *     -geslo
 *   UporabnikRegistracija:
 *    type: object
 *    description: Podatki uporabnika za registracijo
 *    properties:
 *     uporabniskoIme:
 *      type: string
 *      description: Uporabniško ime uporabnika
 *      writeOnly: true
 *      example: S0m3RandomU5N#mE
 *     ePosta:
 *      type: string
 *      description: Elektronski naslov uporabnika (študenta UL) za prijavo, ki mora biti unikaten
 *      example: ea3900@student.uni-lj.si
 *     novoGeslo:
 *      type: string
 *      format: password
 *      description: Geslo za registracijo uporabnika. Vnesti je potrebno 8 znakov. Od teh mora biti najmanj ena velika in ena manjhna črka, geslo pa more vsebovati še minimalno eno številko in en poseben znak iz nabora #$€
 *      example: eXpress12#S2M
 *     ponoviNovoGeslo:
 *      type: string
 *      format: password
 *      description: Geslo more biti (sestavljeno) enako kot zgornje geslo.
 *      example: eXpress12#S2M
 *     naslov:
 *      type: string
 *      description: Domači naslov uporabnika
 *      example: Gornja Ulica 12
 *     posta:
 *      type: integer
 *      description: Poštna številka v katerem uporabniki živi
 *      minimum: 1000
 *      maximum: 9600
 *      example: 9220
 *     kraj:
 *      type: string
 *      description: Občina na katere poštna številka je to
 *      example: Lendava
 *    required:
 *     -uporabniskoIme
 *     -ePosta
 *     -novoGeslo
 *     -ponoviNovoGeslo
 *     -naslov
 *     -posta
 *     -kraj
 *   UporabnikPosodobitevGesla:
 *    type: object
 *    description: Podatki za obnovo gesla uporabnika
 *    properties:
 *     trenutnoGeslo:
 *      type: string
 *      format: password
 *      description: Trenutno geslo 
 *      example: eXpress12#S2M
 *     novoGeslo:
 *      type: string
 *      format: password
 *      description: Geslo za prijavo uporabnika. Vnesti je potrebno 8 znakov. Od teh mora biti najmanj ena velika in ena manjhna črka, geslo pa more vsebovati še minimalno eno številko in en poseben znak iz nabora #$€
 *      example: eXpress12#S2M
 *     potrdiNovoGeslo:
 *      type: string
 *      format: password
 *      description: Geslo more biti (sestavljeno) enako kot zgornje geslo.
 *      example: eXpress12#S2M
 *    required:
 *     -trenutnoGeslo
 *     -novoGeslo
 *     -potrdiNovoGeslo
 *   UporabnikVnosZetona:
 *    type: object
 *    description:  Vnos študentske e-pošte za obnovo žetona
 *    required:
 *     -ePosta
 *    properties:
 *     ePosta:
 *      type: string
 *      description: Elektronski naslov uporabnika (študenta UL) za prijavo
 *      example: ea3900@student.uni-lj.si
 *   UporabnikObnovaGesla:
 *    type: object
 *    description: Podatki za obnovo gesla uporabnika
 *    required:
 *     -ePosta
 *     -zetonZaObnavljanjeGesla
 *     -novoGeslo
 *     -ponoviNovoGeslo
 *    properties:
 *     zetonZaObnavljanjeGesla:
 *      type: string
 *      description: Žeton, ki je prispel na uporabnikov mail, če je uporabnik v bazi
 *      example: ZG6qvC7bfUmUP6BgdNfjRcUoBco6R0m6X86qaJ56
 *     ePosta:
 *      type: string
 *      description: Študentski e-poštni naslov
 *      example: ak3900@student.uni-lj.si
 *     novoGeslo:
 *      type: string
 *      format: password
 *      description: Geslo za uporabnika. Vnesti je potrebno 8 znakov. Od teh mora biti najmanj ena velika in ena manjhna črka, geslo pa more vsebovati še minimalno eno številko in en poseben znak iz nabora #$€
 *      example: eXpress12#S2M
 *     ponoviNovoGeslo:
 *      type: string
 *      format: password
 *      description: Geslo more biti (sestavljeno) enako kot zgornje geslo.
 *      example: eXpress12#S2M
 *   AvtentikacijaOdgovor:
 *    type: object
 *    description: Rezultat uspešne avtentikacije uporabnika
 *    properties: 
 *     zeton: string
 *     description: JWT žeton (primer ne kaže veljavnega žetona)
 *     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBA
 *    required:
 *     -zeton
 *   Napaka:
 *    type: object
 *    description: Podrobnosti napake
 *    properties:
 *      sporočilo:
 *          type: string
 *    required:
 *     - sporočilo
 *    example:
 *      sporočilo: Ne najdem uporabnika
 *   NapakaAvtentikacije:
 *    type: object
 *    description: Podrobnosti napake
 *    required:
 *     - sporočilo
 *    properties:
 *      sporočilo:
 *          type: string
 *    example:
 *      sporočilo: JWT žeton je obvezen.
 *   Uspesno:
 *    type: object
 *    description: Podrobnosti uspeha
 *    required:
 *     - sporočilo
 *    properties:
 *      sporočilo:
 *          type: string
 *    example:
 *      sporočilo: Parametri so obvezni
  *   NapakaModula:
 *    type: object
 *    description: Podrobnosti napake
 *    properties:
 *      sporočilo:
 *          type: string
 *    required:
 *     - sporočilo
 *    example:
 *      sporočilo: Napaka pri pridobivanju modulov.
 *    NapakaModulaNiImena:
 *     type: object
 *     description: Podrobnosti napake
 *     properties:
 *       sporočilo:
 *           type: string
 *     required:
 *      - sporočilo
 *     example:
 *       sporočilo: cd 
 */
 const mongoose = require('mongoose');  //lažje delo z MongoDB bazo
 const crypto = require('crypto');     //uporaba za enosmerno zgoščevanje podatkov (geslo, žeton za obnavljanje gesla,..)
 const jwt = require('jsonwebtoken'); //generiranje JWT žetona za avtentikacijo uporabnika
 /**
  * @swagger
  * components:
  *  schemas:
  *      Uporabnik:
  *          type: object
  *          properties:
  *              uporabniskoIme:
  *                  type: string
  *              ePosta:
  *                  type: string
  *              zgoscenaVrednost:
  *                  type: string
  *              zetonZaObnavljanjeGesla:
  *                  type: string
  *                  default: obnovljeno
  *              jeAdmin:
  *                  type: boolean
  *                  default: false
  *              kraj:
  *                  type: string
  *                  default: Ljubljana
  *              posta:
  *                  type: string
  *                  default: 1000
  *          required:
  *              - uporabniskoIme
  *              - ePosta
  *              - zgoscenaVrednost
  *              - kraj
  *              - posta
  */
 //UPORABNIK
 //Shema uporabnika 
 
 const uporabnikiSchema = new mongoose.Schema({
     uporabniskoIme: {type:String, required: true, unique: true},   // uporabniško ime
     ePosta: {type:String, required: true, unique: true},          // e-pošta
     nakljucnaVrednost: String,                                   // naključna vrednost, ki se generira za potrebe enosmernega zgoščevanja gesla in žetona za obnavljanje (unikatno) 
     zgoscenaVrednost: {type:String, required:true},             // zgoščena vrednost gesla in naključne vrednosti, ki se dejansko preverja
     zetonZaObnavljanjeGesla: String,                           // žeton za obnavljanje gesla  (zgoščena vrednost žetona in  naključne vrednosti)     
     jeAdmin: {type: Boolean, "default":false},                   //informacija ali uporabnik je administrator
     jePotrjen: {type: Boolean, "default":false}                 //potrdimo, da je uporabnik legit
 });

 //Uporabnik si nastavi novo geslo, dobi tudi naključno vrednost
     //Vhod: novo geslo, ki ga določi uporabnik   
 uporabnikiSchema.methods.nastaviGeslo = function(geslo){
     this.nakljucnaVrednost = crypto.randomBytes(16).toString('hex');
     this.zgoscenaVrednost = crypto.pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000,64,'sha512').toString('hex');
 };
 //Uporabnik si avtomatsko ob registraciji (in prošnji nas) nastavi novo geslo, dobi tudi naključno vrednos
     //Vhod: zeton, ki se samodejno generira ob registraciji / prošnji za zahtevo za obnovo 
 uporabnikiSchema.methods.nastaviZeton = function(zeton){
    this.zetonZaObnavljanjeGesla = crypto.pbkdf2Sync(zeton, this.nakljucnaVrednost, 1000,64,'sha512').toString('hex');
 }
 //Preverba veljavnosti žetona ob obnovi gesla in ga takoj nastavimo na novo vrednost
     //Vhod: zeton, ki se samodejno generira ob registraciji / prošnji za zahtevo za obnovo 
     //Izhod: informacija ali je zgoščena vrednost žetona identična z našim žetonom (žeton + naključna vrednost)
 uporabnikiSchema.methods.preveriZeton = function(zeton){
     let jeUjemanje =  this.zetonZaObnavljanjeGesla==crypto.pbkdf2Sync(zeton,this.nakljucnaVrednost,1000,64,'sha512').toString('hex');  
     this.nastaviZeton();
     return jeUjemanje;
     
 }
 //Preverba veljavnosti gesla ob prijavi 
     //Vhod: geslo, ki ga vnesemo  ob  prijavi
     //Izhod: informacija ali je zgoščena vrednost gesla identična z našim geslo (geslo + naključna vrednost)
 uporabnikiSchema.methods.preveriGeslo = function(geslo){
     return this.zgoscenaVrednost == crypto.pbkdf2Sync(geslo,this.nakljucnaVrednost,1000,64,'sha512').toString('hex');
 };
 
 //TODO:
 //PREVERI in NASTAVI daj v skupno (VSAKA svoja kategorija), bolj skalabilno metodo, razširi obstoječe
 /*uporabnikiSchema.methods.preveri = function(tipPodatka, vsebinaPodatka){
     
     switch(tipPodatka){
         case "geslo" :
         
         break;
         case "zeton" :
            
         break;
         default:
             return false;
     }
 
 }*/
 
 //Potrdimo uporabnika (ali je mail veljaven), pokličemo ob potrditvi maila
 uporabnikiSchema.methods.potrdiUporabnika = function()
 { 
     if(!this.jePotrjen){
         this.jePotrjen=true;
     }
 }
 
 //Posodabljanje gesla na zahtevo uporabnika (preko računa), če  novo geslo ustreza vzorcu & sta novo in ponovitev novega gesla enaki & in je staro geslo še veljavno
     //VHOD: staro geslo, ter 2x novo geslo
     //IZHOD: informacija, ali je bilo geslo uspešno spremenjeno
 uporabnikiSchema.methods.posodobiGeslo = function(staroGeslo, novoGeslo, ponoviNovoGeslo){
 
     if(!(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(novoGeslo)) || novoGeslo != ponoviNovoGeslo || !this.preveriGeslo(staroGeslo)){
         return false;  //uporabnika obvesti, da je nekaj šlo narobe pa mu daj hinte naj preveri kaj je crknilo
     }
     this.nastaviGeslo(novoGeslo);  //geslo uspešno spremenjeno
     return true;
 }
 
 //Generiramo novi JWT, vsebovani so _id, uporabniško ime, e pošta, ali je administrator ter datum poteka
 //podpišemo z geslom v .env datoteki
 uporabnikiSchema.methods.generirajJwt = function(){
     const datumPoteka = new Date();
     datumPoteka.setDate(datumPoteka.getDate()+7);
     return jwt.sign({
         _id: this._id,
         uporabniskoIme: this.uporabniskoIme,
         ePosta: this.ePosta,
         jeAdmin: this.jeAdmin,
         potek: parseInt(datumPoteka.getTime() / 1000, 10)
     }, process.env.JWT_GESLO);
 };
 
 //Preverimo ali je dotični uporabnik admninistrator
     //IZHOD: Informacija, ali je uporabnik administrator ali ne.....
 uporabnikiSchema.methods.preveriAdmin = function() { return this.jeAdmin}; //securanje na strani apija za vsak slučaj
 mongoose.model('Uporabnik', uporabnikiSchema, 'Uporabniki');