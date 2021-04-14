import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PovezavaService } from '../../storitve/povezava.service';
import { UporabnikPodatkiStoritev } from '../../storitve/uporabnik-podatki.service';

import { ZgodovinaService } from '../../storitve/zgodovina.service';

@Component({
  selector: 'app-vnesi-novo-geslo',
  templateUrl: './vnesi-novo-geslo.component.html',
  styleUrls: ['./vnesi-novo-geslo.component.scss']
})
export class VnesiNovoGesloComponent implements OnInit {

  public napakaNaObrazcu: string; public napaka: string;
  public uspesnoObvestilo: boolean = false;
  constructor(
    private povezavaStoritev: PovezavaService,
    private usmerjevalnik: Router,
    private uporabnikPodatkiStoritev: UporabnikPodatkiStoritev,
    private pot: ActivatedRoute) {
    
   }
   public noviPodatki = {
     ePosta: '',
     zetonZaPosodobitev: '',
     novoGeslo: '',
     ponoviNovoGeslo: ''
   }
   public glava = {
    naslov: "VNOS NOVEGA GESLA IN ŽETONA",
    podnaslov: "",
  }

   ngOnInit() {
    this.pot.paramMap.subscribe(params => {
      this.noviPodatki.ePosta = params.get("eposta"); //ko končamo z projektom lahko tu dodamo še token
    })
    //console.log(this.noviPodatki.ePosta);
  }
  private nastaviNapako(krepkiTekst: string, opis: string): void{
    this.napakaNaObrazcu = opis;
    this.napaka = krepkiTekst;
  }

  public posljiPodatke():void{
    
    this.nastaviNapako("","");
    if(!this.jePovezava()){
      this.nastaviNapako("Ni povezave","Vzpostavi povezavo z internetom.");return;
    }
    
    if( this.noviPodatki.zetonZaPosodobitev ==""  || this.noviPodatki.ePosta ==""  || this.noviPodatki.novoGeslo ==""  || this.noviPodatki.ponoviNovoGeslo =="" ){
          this.nastaviNapako("Manjkajoči podatki!", " Preveri manjkajoče podatke in jih izpolni."); return;
      }

    if(!new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(this.noviPodatki.ePosta)){
      this.nastaviNapako("Preveri e-pošto!"," Zahtevana je pošta od študentskega UL računa."); return;
    }
    if(!new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(this.noviPodatki.novoGeslo) || this.noviPodatki.novoGeslo != this.noviPodatki.ponoviNovoGeslo){
      this.nastaviNapako("Geslo ni vredu!"," Geslo mora ustrezati naslednjim kriterijem: Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov, hkrati pa naj vsebuje specialni znak glej regex (^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})). Prav tako poskrbi, da bo v obe polji vpisano isto geslo."); return;
    } 
    if(!new RegExp("[A-Za-z0-9]{40}").test(this.noviPodatki.zetonZaPosodobitev)) {
      this.nastaviNapako("Napačen format žetona!"," Vnesi žeton pravilnega formata, ki je presumably prispel na tvoj mail!"); return;
    }
    this.uporabnikPodatkiStoritev.obnoviGeslo(this.noviPodatki).
    then(()=>{
      this.uspesnoObvestilo = true;
    }
    ).catch(sporocilo => this.napakaNaObrazcu = sporocilo);
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
}
