import { Predmet } from "./predmet";
import { Uporabnik } from "./uporabnik";
import { Komentar } from "./komentar";

export class Gradivo {
  _id: string;
  vidno: boolean;
  stPrijav: number;
  ime: string;
  komentarji: Komentar[];
}

export class GradivoForm {
  predmet: string;
  datoteka?: File;
  povezava?: URL; 
}