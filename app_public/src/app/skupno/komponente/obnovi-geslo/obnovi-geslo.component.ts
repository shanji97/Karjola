import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PovezavaService } from '../../storitve/povezava.service';
import { UporabnikPodatkiStoritev } from '../../storitve/uporabnik-podatki.service';

@Component({
  selector: 'app-obnovi-geslo',
  templateUrl: './obnovi-geslo.component.html',
  styleUrls: ['./obnovi-geslo.component.scss']
})
export class ObnoviGesloComponent implements OnInit {

  public napakaNaObrazcu: string; public napaka: string;
  public uspesnoObvestilo: boolean = false;

  public glava = {
    naslov: "PONASTAVITEV GESLA",
    podnaslov: "",
  }
  public obnovitveniPodatki = {
    ePosta: ''
  } 

  constructor(
    private usmerjevalnik: Router,
    private povezavaStoritev: PovezavaService,
    private uporabnikPodatkiStoritev: UporabnikPodatkiStoritev
  ) { }
  ngOnInit() {
  }

 
  private nastaviNapako(krepkiTekst: string, opis: string): void{
    this.napakaNaObrazcu = opis;
    this.napaka = krepkiTekst;
  }
  public posiljanjePodatkov():void{

    this.nastaviNapako("","");
    if(!this.jePovezava()){
      this.nastaviNapako("Ni povezave","Vzpostavi povezavo z internetom.");return;
    }
    if(  this.obnovitveniPodatki.ePosta ==""  || !new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(this.
      obnovitveniPodatki.ePosta) ){
      this.nastaviNapako("Manjoča ali napačna e-pošta!", " Preveri manjkajočo e-pošto in njen format!"); return;
    }

    this.uporabnikPodatkiStoritev.posljiObnovitvenoZahtevo(this.obnovitveniPodatki).
    then(()=>{
      this.uspesnoObvestilo = true;
      this.usmerjevalnik.navigateByUrl("vnesiNovoGeslo/" + this.obnovitveniPodatki.ePosta);
    }
    ).catch(sporocilo => this.napakaNaObrazcu = sporocilo);
    
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
}