import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Gradivo } from '../../razredi/gradivo';
import { Komentar, KomentarForm } from '../../razredi/komentar';
import { GradivoPodatkiService } from '../../storitve/gradivo-podatki.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gradivo',
  templateUrl: './gradivo.component.html',
  styleUrls: ['./gradivo.component.css']
})
export class GradivoComponent implements OnInit {

  constructor(
    private gradivoStoritev: GradivoPodatkiService,
    private authStoritev: AvtentikacijaService
  ) { }

  @Input() gradivo: Gradivo;
  @Input() gradivoChange: EventEmitter<Gradivo> = new EventEmitter<Gradivo>();
  @Output() izbrisi: EventEmitter<Gradivo> = new EventEmitter<Gradivo>();

  prikaziInfo: boolean = false;
  jeAdmin: boolean;
  jePrijavljen: boolean;
  vidno: boolean;

  ngOnInit() {
    this.jePrijavljen = this.authStoritev.jePrijavljen();
    this.jeAdmin = this.authStoritev.jeAdmin();
    this.vidno = this.gradivo.vidno;
  }

  togglePrikaziInfo() {
    this.prikaziInfo = !this.prikaziInfo;
  }

  async prijaviGradivo(): Promise<void> {
    this.gradivo = await this.gradivoStoritev.prijaviGradivo(this.gradivo._id);
    this.gradivoChange.emit(this.gradivo);
  }

  async izbrisiGradivo(): Promise<void> {
    await this.gradivoStoritev.izbrisiGradivo(this.gradivo._id);
    this.izbrisi.emit(this.gradivo);
  }

  async preklopiVidljivost(): Promise<void> {
    this.gradivo = await this.gradivoStoritev.preklopiVidljivostGradiva(this.gradivo._id);
    this.vidno = this.gradivo.vidno;
    this.gradivoChange.emit(this.gradivo);
  }

  objaviKomentar(komentar: Komentar): void {
    this.gradivo.komentarji.push(komentar);
    this.gradivoChange.emit(this.gradivo);
  }

  izbrisiKomentar(komentar: Komentar): void {
    this.gradivo.komentarji = this.gradivo.komentarji.filter(kom => kom._id != komentar._id);
    this.gradivoChange.emit(this.gradivo);
  }

  odpri(): void {
    window.open(`${environment.apiUrl}/gradivo/${this.gradivo._id}`, "_blank");
  }
}
