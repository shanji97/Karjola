import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AdminPodatkiService} from '../../storitve/admin-podatki.service';
import {Osebje} from '../../razredi/osebje';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-osebje',
  templateUrl: './osebje.component.html',
  styleUrls: ['./osebje.component.css']
})
export class OsebjeComponent implements OnInit {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    private pot: ActivatedRoute,
    public activeModal: NgbActiveModal
  ) { }

  osebje: Osebje[];
  idOseba: string;
  @Input() idInput: string;

  public profesorAsistent: Osebje = {
    _id: '',
    ime_priimek: '',
    akademskiNaziv: '',
    izobrazba: '',
    e_mail: '',
    opis: ''
  };

  ngOnInit(): void {
    this.pot.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.idOseba = this.idInput;
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
        this.profesorAsistent.e_mail = posameznaOseba.e_mail;
        this.profesorAsistent.opis = posameznaOseba.opis;
      });
  }

}
