import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Osebje } from '../razredi/osebje';
import { Predmet, ListPredmet } from '../razredi/predmet';
import { environment } from '../../../environments/environment';
import { Modul } from '../razredi/modul';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

@Injectable({
  providedIn: 'root'
})
export class AdminPodatkiService {

  constructor(
    private http: HttpClient,
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ){}

  private httpLastnosti() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.shramba.getItem('karjola-zeton')}`
      })
    };
  };

  private apiUrl = environment.apiUrl;

  /***************************** OSEBJE  *********************************/
  public pridobiOsebje(): Promise<Osebje[]> {
    const url: string = `${this.apiUrl}/osebje`;
    return this.http
      .get(url)
      .toPromise()
      .then(rezultat => rezultat as Osebje[])
      .catch(this.obdelajNapako);
  }

  public dodajOsebje(podatkiObrazca: Osebje): Promise<any> {
    const url: string = `${this.apiUrl}/osebje/`;
    return this.http
      .post(url, podatkiObrazca, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  public posodobiOsebje(podatkiObrazca: Osebje, idOseba: string): Promise<any> {
    const url: string = `${this.apiUrl}/osebje/${idOseba}`;
    return this.http
      .put(url, podatkiObrazca, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  public izbrisiOsebje(idOsebe: string): Promise<any> {
    const url: string = `${this.apiUrl}/osebje/${idOsebe}`;
    return this.http
      .delete(url, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  /***************************** PREDMETI  *********************************/
  public pridobiPredmete(): Promise<ListPredmet[]> {
    const url: string = `${this.apiUrl}/predmeti`;
    return this.http
      .get(url)
      .toPromise()
      .then(rezultat => rezultat as ListPredmet[])
      .catch(this.obdelajNapako);
  }

  public dodajPredmet(podatkiObrazca: Predmet): Promise<any> {
    const url: string = `${this.apiUrl}/predmeti/`;
    return this.http
      .post(url, podatkiObrazca, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  public posodobiPredmet(podatkiObrazca: Predmet, idPredmeta: string): Promise<any> {
    const url: string = `${this.apiUrl}/predmeti/${idPredmeta}`;
    return this.http
      .put(url, podatkiObrazca, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  public izbrisiPredmet(idPredmeta: string): Promise<any> {
    const url: string = `${this.apiUrl}/predmeti/${idPredmeta}`;
    return this.http
      .delete(url, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }


  /***************************** MODULI  *********************************/
  public pridobiModule(): Promise<Modul[]> {
    const url: string = `${this.apiUrl}/moduli`;
    return this.http
      .get(url)
      .toPromise()
      .then(rezultat => rezultat as Modul[])
      .catch(this.obdelajNapako);
  }

  public dodajModul(podatkiObrazca: Modul): Promise<any> {
    const url: string = `${this.apiUrl}/moduli/`;
    return this.http
      .post(url, podatkiObrazca, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  public posodobiModul(podatkiObrazca: Modul, idModula: string): Promise<any> {
    const url: string = `${this.apiUrl}/moduli/${idModula}`;
    return this.http
      .put(url, podatkiObrazca, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  public izbrisiModul(idModula: string): Promise<any> {
    const url: string = `${this.apiUrl}/moduli/${idModula}`;
    return this.http
      .delete(url, this.httpLastnosti())
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
  }

  /***************************** NAPAKE  *********************************/
  private obdelajNapako(napaka: any): Promise<any> {
    let napakaObvestilo = napaka.message;
    if (napaka.error != null && napaka.error.sporocilo != null) {
      napakaObvestilo = napaka.error.sporocilo;
    }
    else if (napaka.error != null && napaka.error.sporočilo != null) {
      napakaObvestilo = napaka.error.sporočilo;
    }
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napakaObvestilo);
  }


  // pretvori array Id-jev osebja/modulov v dejanski objekt da se lahko prikaze ime pri urejanju
  // za elemente ki so bli zbrisani prikaze "deleted" tok da ne crasha in jih lahko odstranis pa shrans.
  public idArrayIntoObjectArray (predmet, osebje: Osebje[], moduli: Modul[]) : Predmet{
    // Copy objekta, da ne spamma v starega
    var noviPredmet : Predmet = {...predmet};
    var profArr: Osebje[] = [];
    var asisArr: Osebje[] = [];
    var modulArr: Modul[] = [];

    for (var i = 0; i < predmet.profesorji.length; i++) {
      // clovek bi tu hotel primerjat z  predmet.profesorji[i]._id ampak mongoose objectId
      // ne shrani kot _id ampak kr kot zaporedje stringov
      const profToPush = osebje.find(oseba => oseba._id === predmet.profesorji[i]);
      if (profToPush) {
        profArr.push(profToPush);
      } else {
        const dummyPerson: Osebje = new Osebje; dummyPerson._id = "-1"; dummyPerson.ime_priimek = "deleted";
        profArr.push(dummyPerson);
      }
    }
    for (var i = 0; i < predmet.asistenti.length; i++) {
      const asisToPush = osebje.find(oseba => oseba._id === predmet.asistenti[i]);
      if (asisToPush) {
        asisArr.push(asisToPush);
      } else {
        const dummyPerson: Osebje = new Osebje; dummyPerson._id = "-1"; dummyPerson.ime_priimek = "deleted";
        asisArr.push(dummyPerson);
      }
    }

    for (var i = 0; i < predmet.moduli.length; i++) {
      const modulToPush = moduli.find(modul => modul._id === predmet.moduli[i]);
      if (modulToPush) {
        modulArr.push(modulToPush);
      } else {
        const dummyModul: Modul = new Modul; dummyModul._id = "-1"; dummyModul.ime = "deleted";
        modulArr.push(dummyModul);
      }
    }

    noviPredmet.profesorji = profArr;
    noviPredmet.asistenti = asisArr;
    noviPredmet.moduli = modulArr;
    return noviPredmet;
  }
}
