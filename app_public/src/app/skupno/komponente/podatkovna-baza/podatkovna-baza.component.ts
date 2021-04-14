import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {Uporabnik} from '../../razredi/uporabnik';

import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { PodatkovnaBazaService } from '../../storitve/podatkovna-baza.service';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-podatkovna-baza',
  templateUrl: './podatkovna-baza.component.html',
  styleUrls: ['./podatkovna-baza.component.css']
})
export class PodatkovnaBazaComponent implements OnInit {

  constructor(
    private avtentikacijaStoritev: AvtentikacijaService,
    private podatkovnaBazaStoritev: PodatkovnaBazaService,
    private povezavaStoritev: PovezavaService,
    private usmerjevalnik: Router,
    private zgodovinaStoritev: ZgodovinaService
  ) { }
  public jeVnosViden: boolean = true;
  public jeIzbrisViden: boolean = true;
  public napakaNaObrazcu: string;
  public uspesnoObvestilo: boolean = false

  ngOnInit() {
  }
  public vnesiPodatke():void{
    this.uspesnoObvestilo = false;
    this.napakaNaObrazcu = '';
    
    this.podatkovnaBazaStoritev.vnesiPodatke().then(() =>{
      this.uspesnoObvestilo = true;
      this.jeVnosViden = false;   //pozneje lahko čekiram če je kaj dejansko notri
      this.jeIzbrisViden = true; //
    }
      
    ).catch(sporocilo=>
    {
       this.napakaNaObrazcu = sporocilo;
       this.uspesnoObvestilo = false
    });
  }
  public izbrisiPodatke():void{
    this.napakaNaObrazcu = '';
    this.uspesnoObvestilo = false;
    this.podatkovnaBazaStoritev.izbrisiPodatke().then(() =>{
      this.uspesnoObvestilo = true;
      this.jeIzbrisViden = false;
      this.jeVnosViden = true;
    }
      
    ).catch(sporocilo=>
    {
       this.napakaNaObrazcu = sporocilo;
       this.uspesnoObvestilo = false
    });
  }
  public jeAdmin(): boolean {
    
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.jeAdmin : false;
  }
  public jePrijavljen(): boolean{
     const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.jeAdmin : false;
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

}
