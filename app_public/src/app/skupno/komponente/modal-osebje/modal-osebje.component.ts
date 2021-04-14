import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Osebje} from '../../razredi/osebje';
import {AdminPodatkiService} from '../../storitve/admin-podatki.service';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-modal-osebje',
  templateUrl: './modal-osebje.component.html',
  styleUrls: ['./modal-osebje.component.css']
})

export class ModalOsebjeComponent implements OnInit {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    public activeModal: NgbActiveModal,
    private povezavaStoritev: PovezavaService
  ) {
  }

  formWarning: boolean = false;
  formSuccess: boolean = false;
  deleteNotification: boolean = false;
  formWarningText: string;
  formSuccessText: string;

  formWarningUpdate: boolean = false;
  formSuccessUpdate: boolean = false;

  izbrisani: string;
  // opcije v <select> za naziv
  akademskiNazivi: string[] = ['brez', 'asistent', 'docent', 'profesor'];

  public novoOsebje: Osebje = {
    _id: '',
    ime_priimek: '',
    akademskiNaziv: '',
    izobrazba: '',
    e_mail: '',
    opis: ''
  };

  @Input() modalTitle: string;
  @Input() osebje: Osebje[];
  @Input() new: boolean;
  @Input() delete: boolean;
  @Input() update: boolean;
  @Input() submitButton: string;
  @Input() inputOseba: Osebje;
  @Input() inputOsebaIx: number;

  // Klice se ob submitu forma
  public dodajNovoOsebo() {
    if (this.novoOsebje.akademskiNaziv === '' || this.novoOsebje.izobrazba === '' || this.novoOsebje.ime_priimek === ''
      || this.novoOsebje.e_mail === '' || this.novoOsebje.opis === '') {
      this.formWarning = true;
    } else {
      this.adminPodatkiStoritev
        .dodajOsebje(this.novoOsebje)
        .then(dodanoOsebje => {
          this.novoOsebje._id = dodanoOsebje._id;
          console.log('dodano osebje ', this.novoOsebje);
          // Posodobi seznam, dodaj na konec(unshift za navrh seznama)
          this.osebje.push(this.novoOsebje);
          // prikazi obvestilo
          this.formSuccess = true;
          setTimeout( () => { this.activeModal.close(); }, 1000 );
        });
    }
  }

  // Ob kliku na trash can
  public izbrisiOsebo() {
    console.log('izbrisi osebo');
    this.adminPodatkiStoritev
      .izbrisiOsebje(this.inputOseba._id)
      .then(odgovor => {
        console.log("uspesno brisanje osebe: ", this.inputOseba.ime_priimek);
        this.formSuccess = true;
        this.formSuccessText = `Oseba ${this.inputOseba.ime_priimek} je bila uspešno izbrisana.`;
        // Vrze vn iz lista predmetov na indeksu izbrisa
        this.osebje.splice(this.inputOsebaIx, 1);
        // Ta indeks se posodobi na veljaven indeks sele ko v seznamu kliknes na delete button
        this.inputOsebaIx = -1;
        setTimeout( () => { this.activeModal.close(); }, 1000 );
      });
  }

  private posodobiOsebo() {
    if (this.inputOseba.akademskiNaziv === '' || this.inputOseba.izobrazba === '' || this.inputOseba.ime_priimek === ''
      || this.inputOseba.e_mail === '' || this.inputOseba.opis === '') {
      this.formWarningUpdate = true;
    } else {
      this.adminPodatkiStoritev
        .posodobiOsebje(this.inputOseba, this.inputOseba._id)
        .then(posodobljenaOseba => {
          // posodobi seznam, dodaj na konec (unshift za na vrh seznama)
          this.osebje[this.inputOsebaIx] = this.inputOseba;
          // this.osebje[this.inputOsebaIx]._id = posodobljenaOseba._id;
          // prikazi obvestilo
          console.log('Oseba posodobljena ', this.osebje[this.inputOsebaIx]);
          this.formSuccessUpdate = true;
          setTimeout( () => { this.activeModal.close(); }, 1000 );
        });
    }
  }

  public izvediAkcijo(akcija: string) {
    switch (akcija) {
      case 'Dodajanje osebe':
        this.dodajNovoOsebo();
        break;

      case 'Brisanje osebe':
        this.izbrisiOsebo();
        break;

      case 'Posodabljanje osebe':
        this.posodobiOsebo();
        break;
    }
  }

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  ngOnInit(): void {
  }

}
