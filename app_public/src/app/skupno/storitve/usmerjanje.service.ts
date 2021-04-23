
import { Router} from '@angular/router';
import {AvtentikacijaService} from './avtentikacija.service';


export class UsmerjanjeService {


  constructor(
    private usmerjevalnik: Router,
    private avtentikacijeStoritev: AvtentikacijaService
  
    ) { }
  
  // Preusmerimo ne zelene strani pod določenimi pogoji
  public preusmeriNezazelene():void{

  
    //Prijavljenega uporabnika ne spustimo na naslednje strani
   if(this.avtentikacijeStoritev.jePrijavljen()){

    //nima kaj iskati na /prijava /registracija in oboje obnove gesel
      console.log(this.usmerjevalnik.url);
   }
  }

  // če je v bazi za določeno zadevo nastavljena preusmeritev, potem 
  public preusmeritevIzBaze():void{

  }
}
