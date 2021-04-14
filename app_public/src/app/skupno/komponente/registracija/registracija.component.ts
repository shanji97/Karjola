import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvtentikacijaService} from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { ZunanjiApiService } from '../../storitve/zunanji-api.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  public napakaNaObrazcu: string; public napaka: string;
  public uspesnoObvestilo: boolean = false;
  constructor(
    private usmerjevalnik: Router,
    private avtentikacijaStoritev: AvtentikacijaService,
    private povezavaStoritev: PovezavaService,
    private zgodovinaStoritev: ZgodovinaService,
    private zunanjiApiStoritev: ZunanjiApiService
  ) { }
  //napake še hendlaj na koncu
  public registracijskiPodatki = {
    _id:'',
    uporabniskoIme: '',
    ePosta: '',
    novoGeslo: '',
    ponoviNovoGeslo: '',
    naslov: '',
    posta: '',
    kraj: '',
    jeAdmin: false
    
  } 
  
  public glava = {
    naslov: "REGISTRACIJA UPORABNIKA",
    podnaslov: "",

  }
  private nastaviNapako(krepkiTekst: string, opis: string): void{
    this.napakaNaObrazcu = opis;
    this.napaka = krepkiTekst;
  }
  public pridobiKraj():void{

    if(this.registracijskiPodatki.posta=="") return;

    this.zunanjiApiStoritev
    .vrniKraj(this.registracijskiPodatki.posta)
    .then( kraj =>{     
      var mojKraj = JSON.parse(JSON.stringify(kraj));
      this.registracijskiPodatki.kraj = mojKraj.kraj;
      this.napakaNaObrazcu="";
    })
    .catch(sporocilo =>{
      
      this.registracijskiPodatki.posta = "";
      this.registracijskiPodatki.kraj = ""
      this.napakaNaObrazcu = sporocilo});
    
  }
  public posiljanjePodatkov(): void {

    this.nastaviNapako("","");

    if(!this.jePovezava()){
      this.nastaviNapako("Ni povezave","Vzpostavi povezavo z internetom.");return;
    }
    if( this.registracijskiPodatki.uporabniskoIme ==""  || this.registracijskiPodatki.ePosta ==""  || this.registracijskiPodatki.novoGeslo ==""  || this.registracijskiPodatki.ponoviNovoGeslo ==""  ||
      this.registracijskiPodatki.naslov ==""  || this.registracijskiPodatki.posta ==""  || this.registracijskiPodatki.kraj =="" ){
          this.nastaviNapako("Manjkajoči podatki!", "Preveri manjkajoče podatke in jih izpolni."); return;
      }
    if(!new RegExp(/^\d{4}$/).test(this.registracijskiPodatki.posta) || parseInt(this.registracijskiPodatki.posta)<1000){
      this.nastaviNapako("Štiri števke!"," Pošta je sestavljena iz štiri števk od 1000 do 9999."); return;
    }

    if(!new RegExp("[a-z]{2}[0-9]{4}@student.uni-lj.si").test(this.registracijskiPodatki.ePosta)){
      this.nastaviNapako("Preveri e-pošto!"," Zahtevana je pošta od študentskega UL računa."); return;
    }
    if(!(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(this.registracijskiPodatki.novoGeslo)) || this.registracijskiPodatki.novoGeslo != this.registracijskiPodatki.ponoviNovoGeslo){
      this.nastaviNapako("Geslo ni vredu!"," Geslo mora ustrezati naslednjim kriterijem: Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov, hkrati pa naj vsebuje specialni znak glej regex (^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})). Prav tako poskrbi, da bo v obe polji vpisano isto geslo."); return;
    }  
    var naslov = this.registracijskiPodatki.naslov; var kraj = this.registracijskiPodatki.kraj; var uporabniskoIme = this.registracijskiPodatki.uporabniskoIme;
    
    if(new RegExp(/<\/?[a-z][\s\S]*>/i).test(naslov) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(kraj) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(uporabniskoIme) || kraj==""){
        this.nastaviNapako("Nedovoljeni znaki!", " Uporabniško ime, naslov ali kraj vsebuje nedovoljene znake!"); return;
    }
      if(this.napakaNaObrazcu!="")return;    
       
      this.izvediRegistracijo();
    }
  private izvediRegistracijo(): void {
    this.avtentikacijaStoritev
      .registracija(this.registracijskiPodatki)
      .then(() => {
        this.usmerjevalnik.navigateByUrl(
          this.zgodovinaStoritev.vrniPredhodnjeUrlNasloveBrezIzbranih()
        );
        this.uspesnoObvestilo = true;
      })
    
      .catch(sporocilo => this.napakaNaObrazcu = sporocilo);
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
  ngOnInit() {
  }

}
