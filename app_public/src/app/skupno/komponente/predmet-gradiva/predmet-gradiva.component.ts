import { Component, OnInit, Input } from '@angular/core';
import { Gradivo } from '../../razredi/gradivo';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Predmet } from '../../razredi/predmet';

@Component({
  selector: 'app-predmet-gradiva',
  templateUrl: './predmet-gradiva.component.html',
  styleUrls: ['./predmet-gradiva.component.css']
})
export class PredmetGradivaComponent implements OnInit {

  constructor(
    private authStoritev: AvtentikacijaService
  ) { }

  @Input() predmet: Predmet;

  jePrijavljen: boolean;

  ngOnInit(): void {
    this.jePrijavljen = this.authStoritev.jePrijavljen();
  }

  izbrisiGradivo(gradivo: Gradivo): void {
    this.predmet.gradiva = this.predmet.gradiva.filter(g => g._id != gradivo._id);
  }

  naloziGradivo(gradivo: Gradivo): void {
    this.predmet.gradiva.push(gradivo);
  }
}
