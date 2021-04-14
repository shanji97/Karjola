import { Gradivo } from "./gradivo";
import { Modul } from "./modul";
import { Osebje } from "./osebje";

export class Predmet {
  _id: string;
  ime: string;
  opis: string;
  letnik: number;
  semester: number;
  profesorji: Osebje[];
  asistenti: Osebje[];
  moduli: Modul[];
  vrstaIzbirnega: number;
  gradiva: Gradivo[];

}

export class ListPredmet {
  _id: string;
  ime: string;
  opis: string;
  letnik: number;
  semester: number;
  profesorji: string[];
  asistenti: string[];
  moduli: string[];
  vrstaIzbirnega: number;
  stGradiv: number;

}