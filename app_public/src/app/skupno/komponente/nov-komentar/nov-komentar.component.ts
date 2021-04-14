import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Komentar, KomentarForm } from '../../razredi/komentar';
import { GradivoPodatkiService } from '../../storitve/gradivo-podatki.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Gradivo } from '../../razredi/gradivo';

@Component({
  selector: 'app-nov-komentar',
  templateUrl: './nov-komentar.component.html',
  styleUrls: ['./nov-komentar.component.css']
})
export class NovKomentarComponent implements OnInit {
  prazenKomentar: boolean;
  komentar: KomentarForm

  constructor(
    private podatkiStoritev: GradivoPodatkiService,
    private authStoritev: AvtentikacijaService
  ) { }

  @Input() gradivo: Gradivo;
  @Output() objavi: EventEmitter<Komentar> = new EventEmitter<Komentar>();

  ngOnInit(): void {
    this.prazenKomentar = false;
    this.komentar = {
      gradivo: this.gradivo._id,
      avtor: this.authStoritev.vrniTrenutnegaUporabnika()._id,
      anonimno: false,
      komentar: ""
    };
  }

  posodobiBesedilo(value: string): void {
    this.komentar.komentar = value;
  }

  objaviKomentar(): void {
    if (this.komentar.komentar == "")
      this.prazenKomentar = true;
    else {
      this.prazenKomentar = false;
      this.podatkiStoritev
        .objaviKomentar(this.gradivo._id, this.komentar)
        .then(kom => {
          this.komentar.komentar = "";
          this.objavi.emit(kom);
        });
    }
  }
}
