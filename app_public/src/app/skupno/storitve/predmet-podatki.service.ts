import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Predmet } from '../razredi/predmet';
import { environment } from '../../../environments/environment';
import { Gradivo } from '../razredi/gradivo';
import { AvtentikacijaService } from './avtentikacija.service';


@Injectable({
  providedIn: 'root'
})
export class PredmetPodatkiService {

  constructor(
    private http: HttpClient,
    private authStoritev: AvtentikacijaService
    ) { }

  private apiUrl = environment.apiUrl;

  private httpLastnosti() {
    if (this.authStoritev.vrniZeton()) {
      return {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authStoritev.vrniZeton()}`
        })
      };
    }
    else {
      return{ headers: null };
    }
  }


  /***************************** PREDMETI  *********************************/
  public pridobiPredmetById(predmetId: string): Promise<Predmet> {
    const url: string = `${this.apiUrl}/predmeti/${predmetId}`;
    return this.http
      .get(url, this.httpLastnosti())
      .toPromise()
      .then(rezultat => rezultat as Predmet)
      .catch(this.obdelajNapako);
  }
  
  
  /***************************** NAPAKE  *********************************/
  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
}
