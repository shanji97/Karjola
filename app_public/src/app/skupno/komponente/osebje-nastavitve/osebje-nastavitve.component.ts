import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
import { Osebje } from '../../razredi/osebje';
import { switchMap } from 'rxjs/operators';
import { PovezavaService } from '../../storitve/povezava.service';
@Component({
  selector: 'app-osebje-nastavitve',
  templateUrl: './osebje-nastavitve.component.html',
  styleUrls: ['./osebje-nastavitve.component.css']
})
export class OsebjeNastavitveComponent implements OnInit {
  naslov = 'NASTAVITVE OSEBJA';

  osebje: Osebje[];
  idOseba: string;

  public profesorAsistent = {
    _id: '',
    ime_priimek: '',
    akademskiNaziv: '',
    izobrazba: '',
    opis: ''
  };

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    private pot: ActivatedRoute,
    private povezavaStoritev: PovezavaService
  ) { }

  ngOnInit() {
    this.pot.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.idOseba = params.get('idOseba');
          return this.adminPodatkiStoritev.pridobiOsebje();
        })
      )
      .subscribe((osebje: Osebje[]) => {
        this.osebje = osebje;
        const posameznaOseba = osebje.find(x => x._id === this.idOseba);
        this.profesorAsistent._id = posameznaOseba._id;
        this.profesorAsistent.ime_priimek = posameznaOseba.ime_priimek;
        this.profesorAsistent.akademskiNaziv = posameznaOseba.akademskiNaziv;
        this.profesorAsistent.izobrazba = posameznaOseba.izobrazba;
        this.profesorAsistent.opis = posameznaOseba.opis;
      });
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
}
