import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IskanjeService {

  constructor(
    private http: HttpClient
  ) { }
  private apiUrl = environment.apiUrl;

  public generirajUrlZaPoizvedbo(iskalniIzraz: string, predmetiFilter: boolean, osebjeFilter: boolean, pageLimit: number, offset: number) {
    let params = new HttpParams();
    params = params.set('iskalniIzraz', iskalniIzraz);
    params = params.set('predmeti', predmetiFilter.toString());
    params = params.set('osebje', osebjeFilter.toString());
    params = params.set('limit', pageLimit.toString());
    params = params.set('offset', offset.toString());

    return params.toString();
  }

  public pridobiZadetke(url: string): Promise<any[]> {
    return this.http
      .get(`${this.apiUrl}/iskanje?` + url)
      .toPromise()
      .then(rezultat => rezultat as any[])
      .catch(this.obdelajNapako);
  }

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

}
