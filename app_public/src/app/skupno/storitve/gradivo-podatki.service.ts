import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Predmet } from '../razredi/predmet';
import { environment } from '../../../environments/environment';
import { Gradivo, GradivoForm } from '../razredi/gradivo';
import { KomentarForm, Komentar } from '../razredi/komentar';
import { AvtentikacijaService } from './avtentikacija.service';

@Injectable({
  providedIn: 'root'
})
export class GradivoPodatkiService {

  constructor(
    private http: HttpClient,
    private authStoritev: AvtentikacijaService
  ) { }

  private apiUrl = environment.apiUrl;

  private httpLastnosti() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authStoritev.vrniZeton()}`
      })
    }
  }

  private pretvoriRezultat(rez: any): Gradivo {
    var gradivo: Gradivo = rez as Gradivo;
    gradivo.komentarji = [];
    return gradivo;
  }

  public naloziGradivo(gradivoForm: GradivoForm): Promise<Gradivo> {
    var formData: FormData = new FormData();
    if (gradivoForm.datoteka) 
      formData.set('datoteka', gradivoForm.datoteka);
    else if (gradivoForm.povezava)
      formData.set('povezava', gradivoForm.povezava.toString());

    const url: string = `${this.apiUrl}/predmeti/${gradivoForm.predmet}/gradivo`;
    return this.http
      .post(url, formData, this.httpLastnosti())
      .toPromise()
      .then(rezultat => this.pretvoriRezultat(rezultat))
      .catch(napaka => {
        this.obdelajNapako(napaka);
        throw napaka;
      });
  }

  public prijaviGradivo(gradivoId: string): Promise<Gradivo> {
    const url: string = `${this.apiUrl}/gradivo/${gradivoId}/prijava`;
    return this.http
      .post(url, {})
      .toPromise()
      .then(rezultat => this.pretvoriRezultat(rezultat))
      .catch(this.obdelajNapako);
  }

  public izbrisiGradivo(gradivoId: string): Promise<any> {
    const url: string = `${this.apiUrl}/gradivo/${gradivoId}`;
    return this.http
      .delete(url, this.httpLastnosti())
      .toPromise()
      .catch(this.obdelajNapako);
  }

  public preklopiVidljivostGradiva(gradivoId: string): Promise<Gradivo> {
    const url: string = `${this.apiUrl}/gradivo/${gradivoId}/preklopiVidljivost`;
    return this.http
      .post(url, {}, this.httpLastnosti())
      .toPromise()
      .then(rezultat => this.pretvoriRezultat(rezultat))
      .catch(this.obdelajNapako);
  }

  public objaviKomentar(gradivoId: string, komentarForm: KomentarForm): Promise<Komentar> {
    const url: string = `${this.apiUrl}/gradivo/${gradivoId}/komentar`;
    return this.http
      .post(url, komentarForm, this.httpLastnosti())
      .toPromise()
      .then(rezultat => rezultat as Komentar)
      .catch(this.obdelajNapako);
  }

  public prijaviKomentar(gradivoId: string, komentarId: string): Promise<Komentar> {
    const url: string = `${this.apiUrl}/gradivo/${gradivoId}/komentar/${komentarId}/prijava`;
    return this.http
      .post(url, {})
      .toPromise()
      .then(rezultat => rezultat as Komentar)
      .catch(this.obdelajNapako);
  }

  public izbrisiKomentar(gradivoId: string, komentarId: string): Promise<any> {
    const url: string = `${this.apiUrl}/gradivo/${gradivoId}/komentar/${komentarId}`;
    return this.http
      .delete(url, this.httpLastnosti())
      .toPromise()
      .catch(this.obdelajNapako);
  }

  /***************************** NAPAKE  *********************************/
  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
}
