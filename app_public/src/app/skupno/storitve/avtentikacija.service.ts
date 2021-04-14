import { Inject, Injectable} from '@angular/core';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';
import { Uporabnik, UporabnikPrijava } from '../razredi/uporabnik';
import { RezultatAvtentikacije } from '../razredi/rezultat-avtentikacije';
import { UporabnikPodatkiStoritev } from '../storitve/uporabnik-podatki.service';

@Injectable({
  providedIn: 'root'
})
export class AvtentikacijaService {


  constructor(
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage,
    private uporabnikPodatkiStoritev: UporabnikPodatkiStoritev
  ) { }
  private b64Utf8(niz: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(niz),
          (znak: string) => {
            return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
          }
        )
        .join('')
    );
  };
  public jePrijavljen(): boolean {
    const zeton: string = this.vrniZeton();
    if (zeton) {
      const koristnaVsebina = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
      return koristnaVsebina.potek > (Date.now() / 1000);
    }
    else {
      return false;
    }
  }
  public vrniTrenutnegaUporabnika():Uporabnik{
    if(this.jePrijavljen()){
      const zeton: string = this.vrniZeton();
      const {_id, uporabniskoIme,ePosta,jeAdmin} = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
      return { _id, uporabniskoIme,ePosta,jeAdmin} as Uporabnik;
  }
}
public jeAdmin():boolean{
  if(this.jePrijavljen()){
    const zeton: string = this.vrniZeton();
    const zetonObj = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
    if (zetonObj.jeAdmin) return true;
  }
  return false;
}
  public async prijava(uporabnikZaPrijavo: UporabnikPrijava): Promise<any>{
    return this.uporabnikPodatkiStoritev
    .prijava(uporabnikZaPrijavo)
    .then((rezultatAvtentikacije: RezultatAvtentikacije) =>{
      this.shraniZeton(rezultatAvtentikacije["žeton"]);
    });
  }
  
  public async registracija(uporabnik: Uporabnik): Promise<any>{
    return this.uporabnikPodatkiStoritev
    .registracija(uporabnik)
    .then((rezultatAvtentikacije: RezultatAvtentikacije) =>{
      this.shraniZeton(rezultatAvtentikacije["žeton"]);
    });
  }
  
  public odjava(): void{
    this.shramba.removeItem('karjola-zeton');
  }
  public vrniZeton():string{
    return this.shramba.getItem('karjola-zeton');
  }
  public shraniZeton(zeton : string): void {
    this.shramba.setItem('karjola-zeton',zeton);
  }

}
