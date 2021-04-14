import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Komentar } from '../../razredi/komentar';
import { GradivoPodatkiService } from '../../storitve/gradivo-podatki.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Gradivo } from '../../razredi/gradivo';
import { Uporabnik } from '../../razredi/uporabnik';

@Component({
  selector: 'app-komentar',
  templateUrl: './komentar.component.html',
  styleUrls: ['./komentar.component.css']
})
export class KomentarComponent implements OnInit {

  constructor(
    private gradivoStoritev: GradivoPodatkiService,
    private authStoritev: AvtentikacijaService
  ) { }

  @Input() gradivo: Gradivo;
  @Input() komentar: Komentar;
  @Output() izbrisi: EventEmitter<Komentar> = new EventEmitter<Komentar>();
  @Output() prijavi: EventEmitter<Komentar> = new EventEmitter<Komentar>();

  jeAdmin: boolean;
  jePrijavljen: boolean;
  jeAvtor: boolean;

  ngOnInit() {
    console.log(this.komentar);
    this.jePrijavljen = this.authStoritev.jePrijavljen();
    this.jeAdmin = this.authStoritev.jeAdmin();
    var uporabnik: Uporabnik = this.authStoritev.vrniTrenutnegaUporabnika();
    if (uporabnik) {
      this.jeAvtor = this.komentar.avtor 
                    && uporabnik._id == this.komentar.avtor._id;
    }
    else {
      this.jeAvtor = false;
    }
    
  }
  
  async prijaviKomentar(): Promise<void> {
    this.komentar = await this.gradivoStoritev.prijaviKomentar(this.gradivo._id, this.komentar._id);
    this.prijavi.emit(this.komentar);
  }

  async izbrisiKomentar(): Promise<void> {
    await this.gradivoStoritev.izbrisiKomentar(this.gradivo._id, this.komentar._id);
    this.izbrisi.emit(this.komentar);
  }
}
