import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvtentikacijaService} from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';
import { UsmerjanjeService} from '../../storitve/usmerjanje.service';
import { ZgodovinaService } from '../../storitve/zgodovina.service';


@Component({
  
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {

  public napakaNaObrazcu: string; public napaka: string;
  public uspesnoObvestilo: boolean = false;
  public href: string ="";
  constructor(
    private usmerjevalnik: Router,
    private avtentikacijaStoritev: AvtentikacijaService,
    private povezavaStoritev: PovezavaService,
    //private usmerjanjeStoritev: UsmerjanjeService,
    private zgodovinaStoritev: ZgodovinaService
  ) {
    //
   }
  //napake še hendlaj na koncu
  public prijavniPodatki = {  
    ePosta: '',
    geslo: '' 
  } 
  
  
  public glava = {
      naslov: "PRIJAVA UPORABNIKA",
      podnaslov: "",

    }
  
  private nastaviNapako(krepkiTekst: string, opis: string): void{
    this.napakaNaObrazcu = opis;
    this.napaka = krepkiTekst;
    //
  }
  public posiljanjePodatkov(): void {

    this.nastaviNapako("","");
    if(!this.jePovezava()){
      this.nastaviNapako("Ni povezave","Vzpostavi povezavo z internetom.");return;
    }
    if(  this.prijavniPodatki.ePosta ==""  || this.prijavniPodatki.geslo =="" ){
          this.nastaviNapako("Manjkajoči podatki!", "Preveri manjkajoče podatke in jih izpolni."); return;
      }
    if(!new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(this.prijavniPodatki.ePosta)){
      this.nastaviNapako("Preveri e-pošto!"," Zahtevana je pošta od študentskega UL računa."); return;
    }
 
  if(new RegExp(/<\/?[a-z][\s\S]*>/i).test(this.prijavniPodatki.geslo) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(this.prijavniPodatki.ePosta)){
      this.nastaviNapako("Nedovoljeni znaki!", " Uporabnisko ime ali geslo vsebuje nedovoljene znake"); return;
  }
      this.izvediPrijavo();
      if(this.napakaNaObrazcu !="") return;
  }
  private izvediPrijavo(): void {
    this.avtentikacijaStoritev
      .prijava(this.prijavniPodatki)
      .then(() => {
        this.uspesnoObvestilo = true;
        this.usmerjevalnik.navigateByUrl(
          this.zgodovinaStoritev.vrniPredhodnjeUrlNasloveBrezIzbranih()
        );
      })
      .catch(sporocilo => this.napakaNaObrazcu = sporocilo);
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  ngOnInit() {
  
    //the routing service is called here 
    //this.usmerjanjeStoritev.preusmeriNezazelene();
  }

}
