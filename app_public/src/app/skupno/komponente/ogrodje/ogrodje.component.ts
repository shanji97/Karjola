import { Component, OnInit } from '@angular/core';
import { Uporabnik } from '../../razredi/uporabnik';
import { ZgodovinaService} from '../../storitve/zgodovina.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css']
})
export class OgrodjeComponent implements OnInit {

  constructor(private avtentikacijaStoritev: AvtentikacijaService, private zgodovinaStoritev: ZgodovinaService) { }

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
  ngOnInit() {
  }

}
