import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';

import { switchMap } from 'rxjs/operators';
import { Uporabnik } from '../../razredi/uporabnik';
import { UporabnikPodatkiStoritev } from '../../storitve/uporabnik-podatki.service';
import { ZgodovinaService } from '../../storitve/zgodovina.service';
@Component({
  selector: 'app-uporabnik',
  templateUrl: './uporabnik.component.html',
  styleUrls: ['./uporabnik.component.css']
})
export class UporabnikComponent implements OnInit {

  uporabnik = {
    ime: 'Ta id te je pripeljal na neobstoječega uporabnika.',
    ePosta: 'Preveri id in/ali se obrni admine.'   //to ni dobro, pridobi iz baze
  }
  upoRabnik: Uporabnik;
  public id: string;
  public napaka: string;
  public napakaNaObrazcu: string;
  public sporocilo: string;
  public uspesnoObvestilo: boolean = false;
  public obstaja: boolean = false;

  public uporabniskiPodatki = {
    trenutnoGeslo: '',
    novoGeslo: '',
    potrdiNovoGeslo: '',
    idUporabnika:''
    
  }
  private nastaviNapako(krepkiTekst: string, opis: string): void {
    this.napakaNaObrazcu = opis;
    this.napaka = krepkiTekst;
  }
  private pridobiUporabnika(identifikatorUporabnika: string): void{
    this.uspesnoObvestilo = false;
    this.sporocilo = " Pridobivam uporabnika."

    this.uporabnikPodatkiStoritev.pridobiUporabnika(identifikatorUporabnika).then( rezultat =>{
      this.obstaja = true;
      this.uporabnik.ime = rezultat.uporabniskoIme;
      this.uporabnik.ePosta  = rezultat.ePosta;
      this.sporocilo ="Zdravo!";  
      this.uspesnoObvestilo = true;
    }
      
    
    ).catch(sporocilo =>{
      this.napakaNaObrazcu = sporocilo;
      this.obstaja =false;
    } );
  }

  constructor(
    private avtentikacijaStoritev: AvtentikacijaService,
    private povezavaStoritev: PovezavaService,
    private uporabnikPodatkiStoritev: UporabnikPodatkiStoritev,
    private zgodovinaStoritev: ZgodovinaService,
    private usmerjevalnik: Router,
    private pot: ActivatedRoute,
  ) { }

  ngOnInit() {
   
    while(!this.jePovezava()) {this.sporocilo == "Ni še povezave!"}
    this.pot.paramMap.subscribe(params => {
      this.id = params.get("idUporabnika"); //ko končamo z projektom lahko tu dodamo še token
    })
    this.pridobiUporabnika(this.id);
   /* this.pot.paramMap
    .pipe(
      switchMap((params: ParamMap) => {
        this.id= params.get('idUporabnika');
        return this.uporabnikPodatkiStoritev.pridobiUporabnika(this.id);
      })
    )
    .subscribe((uporabnik: Uporabnik) => {
      console.log(uporabnik.uporabniskoIme);
      this.uporabnik.ime= uporabnik.uporabniskoIme
      this.uporabnik.ePosta = uporabnik.ePosta  });*/
  }
  //#region METODE ZA DOSTOP
  public odjava(): void {

    this.avtentikacijaStoritev.odjava();

    this.sporocilo = "Odjava uspešna. Navigiraj na naslednjo stran!";
    this.usmerjevalnik.navigateByUrl(
      this.zgodovinaStoritev.vrniPredhodnjeUrlNasloveBrezIzbranih()
    );
  }
  public jePrijavljen(): boolean {
    return this.avtentikacijaStoritev.jePrijavljen();
  }
  public vrniUporabnika(): string {
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.uporabniskoIme : 'Anonimen uporabnik';
  }
  public vrniEposto(): string {
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.ePosta : 'Ni elektronske pošte';
  }
  public vrniId(): string {
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik._id : 'Ni identitete';
  }
  public jeTrenutni(): boolean {
    return this.id == this.vrniId();
  }
  public jeAdmin(): boolean {
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.jeAdmin : false;
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
  //#endregion
  public nastaviNovoGeslo(): void {
    this.sporocilo ="";
    this.uspesnoObvestilo = false;

    this.nastaviNapako("", "");
    if(!this.jePovezava()){
      this.nastaviNapako("Ni povezave","Vzpostavi povezavo z internetom.");return;
    }
    if (this.uporabniskiPodatki.trenutnoGeslo == "" || this.uporabniskiPodatki.novoGeslo == "" || this.uporabniskiPodatki.potrdiNovoGeslo == "") {
      this.nastaviNapako("Manjkajoči podatki!", " Preveri manjkajoče podatke in jih izpolni.");
      return;
    }
    if (new RegExp(/<\/?[a-z][\s\S]*>/i).test(this.uporabniskiPodatki.trenutnoGeslo) || new RegExp(/<\/?[a-z][\s\S]*>/i).test(this.uporabniskiPodatki.novoGeslo)) {
      this.nastaviNapako("Nedovoljeni znaki!", " Uporabnisko ime, naslov ali kraj vsebuje nedovoljene znake"); return;
    }
    if (!(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})").test(this.uporabniskiPodatki.novoGeslo)) || this.uporabniskiPodatki.novoGeslo != this.uporabniskiPodatki.potrdiNovoGeslo) {
      this.nastaviNapako("Geslo ni vredu!", " Geslo mora ustrezati naslednjim kriterijem: Geslo more vsebovati vsaj eno veliko in eno majhno črko. Geslo mora vsebovati vsaj eno številko in biti dolgo 8 znakov, hkrati pa naj vsebuje specialni znak glej regex (^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@€#\$%\^&\*])(?=.{8,})). Prav tako poskrbi, da bo v obe polji vpisano isto geslo."); return;
    }
    this.uporabniskiPodatki.idUporabnika = this.vrniId();

    this.uporabnikPodatkiStoritev.spremeniGeslo(this.uporabniskiPodatki)
    .then(()=>{
      this.uspesnoObvestilo = true;
      this.sporocilo ="Sprememba gesla uspešna!";
      this.uporabniskiPodatki.trenutnoGeslo ="";
      this.uporabniskiPodatki.novoGeslo ="";
      this.uporabniskiPodatki.potrdiNovoGeslo ="";
      
    }
    ).catch(sporocilo => this.napakaNaObrazcu = sporocilo);

    
  }
  public izbrisiUporabnika(): void {
    this.uspesnoObvestilo = false;
    this.sporocilo ="";
    if(!this.jePovezava()){
      this.nastaviNapako("Ni povezave","Vzpostavi povezavo z internetom.");return;
    }

    this.uporabnikPodatkiStoritev.izbrisiUporabnika(this.id).then(() =>{
      this.avtentikacijaStoritev.odjava();
      this.uspesnoObvestilo = true;
      this.sporocilo = "Uporabnik uspešno izbrisan!";

      this.usmerjevalnik.navigateByUrl(
        this.zgodovinaStoritev.vrniPredhodnjeUrlNasloveBrezIzbranih()
      );
    }).catch(sporocilo => this.napakaNaObrazcu = sporocilo);
    
    
    
  }
}

