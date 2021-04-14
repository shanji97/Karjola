import { Injectable,Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PodatkovnaBazaService {

  
  private apiUrl = environment.apiUrl;
  private url = 'db';

  public vnesiPodatke(): Promise<any> {
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.shramba.getItem('karjola-zeton')}` 
      })
    };
    return this.http
      .post(`${this.apiUrl}/${this.url}`,'' ,httpLastnosti)
      .toPromise()
      .then(rezultat => rezultat as any)
      .catch(this.obdelajNapako);
    }

    public izbrisiPodatke(): Promise<any> { // vidi kdo kaj drugačnega na tej funkciji in na zgornji?
      const httpLastnosti = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.shramba.getItem('karjola-zeton')}` 
        })
      };
      return this.http
        .delete(`${this.apiUrl}/${this.url}`, httpLastnosti)
        .toPromise()
        .then(rezultat => rezultat as any)
        .catch(this.obdelajNapako);
      
      }

 

constructor(private http: HttpClient,
  @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage) { }

  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
  
}
