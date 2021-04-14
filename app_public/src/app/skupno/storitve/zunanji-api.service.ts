import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { ZunanjiAPI } from '../razredi/zunanjiAPI';
@Injectable({
  providedIn: 'root'
})
export class ZunanjiApiService {
  constructor(
    private http: HttpClient
  ) { }


  public vrniKraj(postnaStevilka :string): Promise<ZunanjiAPI>{
    const url: string = "https://api.lavbic.net/kraji/" + postnaStevilka;
    return this.http
    .get(url)
    .toPromise()
    .then(rezultat  => rezultat as ZunanjiAPI)
    .catch(this.obdelajNapako);
  }
  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject("Pošta ni najdena! Preveri ali sploh ta pošta obstaja in ali povezava deluje." || napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }


}
