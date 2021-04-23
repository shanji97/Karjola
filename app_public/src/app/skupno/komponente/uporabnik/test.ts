
/*import { Router} from '@angular/router';
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

    
      console.log(this.usmerjevalnik.url);
   }
  }


//https://stackoverflow.com/questions/40933619/how-to-redirect-to-a-certain-route-based-on-condition-in-angular-2



import { Route } from '@angular/compiler/src/core';
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Router} from '@angular/router';
import { AvtentikacijaService } from './avtentikacija.service';

@Injectable()

export class AuthGuard implements CanActivate{
  constructor(
    private avtentikacijaStoritev: AvtentikacijaService,
    private usmerjevalnik: Router
  ){  }
  canActivate(){
    
    //ERROR I GET

    /


    //=========================
    if(this.avtentikacijaStoritev.jePrijavljen()){

    
      console.log(this.usmerjevalnik.url);
   }

  }
}


*/






  
