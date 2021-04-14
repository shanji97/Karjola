import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

import { Uporabnik,UporabnikPrijava,UporabnikEmailZaObnovo,UporabnikObnovaGesla,UporabnikPosodobitevGesla,UporabnikPodrobnosti  } from '../razredi/uporabnik';
import { RezultatAvtentikacije } from '../razredi/rezultat-avtentikacije';

@Injectable({
  providedIn: 'root'
})
export class UporabnikPodatkiStoritev {
  

  constructor(
    private http: HttpClient,
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ) { }
  private apiUrl = environment.apiUrl;
  //#region Prijava in registracija
  public prijava(uporabnikZaPrijavo: UporabnikPrijava): Promise<RezultatAvtentikacije> {
    return this.avtentikacija('uporabniki/prijava', uporabnikZaPrijavo);
  }
  public registracija(uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
    return this.avtentikacija('uporabniki/registriraj', uporabnik);
  }
  private avtentikacija(urlNaslov: string, uporabnik: any): Promise<RezultatAvtentikacije> {
    
    const url: string = `${this.apiUrl}/${urlNaslov}`;
    return this.http
      .post(url, uporabnik)
      .toPromise()
      .then(rezultat => rezultat as RezultatAvtentikacije)
      .catch(this.obdelajNapako);

  }
  //#endregion
  
  public posljiObnovitvenoZahtevo(uporabnik: UporabnikEmailZaObnovo): Promise<any>{
    const url: string = `${this.apiUrl}/uporabniki/vnosZetona`;
    return this.http
    .put(url,uporabnik)
    .toPromise()
    .then(rezultat => rezultat as string)
    .catch(this.obdelajNapako);

  }
  public obnoviGeslo(uporabnik: UporabnikObnovaGesla): Promise<any>{
    const url: string =`${this.apiUrl}/uporabniki/obnovitevGesla`;
    return this.http
    .put(url,uporabnik)
    .toPromise()
    .then(rezultat => rezultat as string)
    .catch(this.obdelajNapako);
  }
  public pridobiUporabnike(): Promise<UporabnikPodrobnosti[]>{
   const url: string = `${this.apiUrl}/uporabniki/`;
   return this.http
   .get(url)
   .toPromise()
   .then(odgovor => odgovor as UporabnikPodrobnosti[])
   .catch(this.obdelajNapako);
  }
  public pridobiUporabnika(identifikatorUporabnika : string): Promise<Uporabnik>{
    const url: string = `${this.apiUrl}/uporabniki/${identifikatorUporabnika}` ;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.shramba.getItem('karjola-zeton')}`
      })
    };
    return this.http.get(url,httpLastnosti).toPromise().then(rezultat => rezultat as Uporabnik).catch(this.obdelajNapako);
  }

  public spremeniGeslo(uporabnik:UporabnikPosodobitevGesla):Promise<any>{
     
      
      const url: string = `${this.apiUrl}/uporabniki/${uporabnik.idUporabnika}/posodobiGeslo` ;
      const httpLastnosti = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.shramba.getItem('karjola-zeton')}`
        })
      };
      return this.http
      .put(url,uporabnik,httpLastnosti)
      .toPromise()
      .then(rezultat => rezultat as any)
      .catch(this.obdelajNapako);
  }
  public izbrisiUporabnika(identifikatorUporabnika:string):Promise<any>{
    const url: string = `${this.apiUrl}/uporabniki/${identifikatorUporabnika}` ;
      const httpLastnosti = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.shramba.getItem('karjola-zeton')}`
        })
      };
      return this.http
      .delete(url,httpLastnosti)
      .toPromise()
      .then(rezultat => rezultat as any)
      .catch(this.obdelajNapako);
  }
  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
}
