import { Gradivo } from "./gradivo";
import { Predmet } from "./predmet";
import { Uporabnik } from "./uporabnik";

export class Komentar {
  _id: string;
  avtor: {
    _id: string,
    uporabniskoIme: string
  };
  datum: Date;
  anonimnost: boolean;
  stPrijav: number;
  besedilo: string;
}

export class KomentarForm {
  gradivo: string;
  avtor: string;
  anonimno: boolean;
  komentar: string;
}