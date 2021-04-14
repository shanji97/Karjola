import { Component, OnInit } from '@angular/core';
import { Uporabnik } from '../../razredi/uporabnik';
import { ZgodovinaService} from '../../storitve/zgodovina.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';
@Component({
  selector: 'app-glava',
  templateUrl: './glava.component.html',
  styleUrls: ['./glava.component.css']
})
export class GlavaComponent implements OnInit {
  
  
  constructor(private avtentikacijaStoritev: AvtentikacijaService, private zgodovinaStoritev: ZgodovinaService, private povezavaStoritev: PovezavaService) { }

  public iskalniIzraz: string;

  public odjava(): void{
    this.avtentikacijaStoritev.odjava();
  }
  public jePrijavljen():boolean{
    return this.avtentikacijaStoritev.jePrijavljen();
  }
  
  public vrniUporabnika(): string{
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.uporabniskoIme : 'Anonimen uporabnik';
  }
  public vrniId():string{
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik._id : '';
  }
  
  public jeAdmin():boolean{
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.jeAdmin : false;
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
  ngOnInit() {
  }

}

