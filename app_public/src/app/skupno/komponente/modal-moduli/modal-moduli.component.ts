import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Modul } from '../../razredi/modul';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
import { PovezavaService } from '../../storitve/povezava.service';
@Component({
  selector: 'app-modal-moduli',
  templateUrl: './modal-moduli.component.html'
})
export class ModalModuliComponent implements OnInit {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    public activeModal: NgbActiveModal,
    private povezavaStoritev: PovezavaService
  ) { }

  public noviModul: Modul = {
    _id: '',
    ime: ''
  }

  @Input() modalTitle: string;
  @Input() moduli: Modul[]; 
  @Input() new: boolean;
  @Input() delete: boolean;
  @Input() update: boolean;
  @Input() submitButton: string;
  @Input() inputModul: Modul;
  @Input() inputModulIx: number;

  formWarning: boolean = false;
  formSuccess: boolean = false;
  formWarningText: string;
  formSuccessText: string;

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  private dodajNovModul() {
    // Input checking, ce so izpolnjena vsa polja dodaj, drugace prikazi warning
    if (this.noviModul.ime == '' || this.imeZasedeno(this.noviModul.ime)) {
      this.formWarning = true;
      this.noviModul.ime == '' ? this.formWarningText = 'Ime modula je obvezen parameter' : this.formWarningText= `Modul z imenom ${this.noviModul.ime} že obstaja.`;
    } else {
      this.adminPodatkiStoritev
        .dodajModul(this.noviModul)
        .then( dodaniModul => {
          console.log("dodan modul ", dodaniModul);
          // Posodobi seznam, dodaj na konec(unshift za navrh seznama)
          this.moduli.push(dodaniModul);
          // prikazi obvestilo
          this.formSuccess = true;
          this.formSuccessText = `Modul ${this.noviModul.ime} je bil uspešno dodan.`;
          setTimeout( () => { this.activeModal.close(); }, 1000 );
        });
    }
  }

  private posodobiModul() {
    // Input checking, ce so izpolnjena vsa polja dodaj, drugace prikazi warning
    if (this.noviModul.ime == '' || this.noviModul.ime == this.inputModul.ime) {
      this.formWarning = true;
      this.noviModul.ime == '' ? this.formWarningText = 'Novo ime modula je obvezen parameter' : this.formWarningText = 'Novo ime mora biti različno od obstoječega';
    } else {
      this.adminPodatkiStoritev
        .posodobiModul(this.noviModul, this.inputModul._id)
        .then( posodobljeniModul => {
          console.log("Modul posodobljen ", posodobljeniModul);
          // Posodobi seznam, dodaj na konec(unshift za navrh seznama)
          this.moduli[this.inputModulIx].ime = this.noviModul.ime;
          // prikazi obvestilo
          this.formSuccess = true;
          this.formSuccessText = 'Modul je bil uspešno posodobljen.';
          setTimeout( () => { this.activeModal.close(); }, 1000 );
        });
    }
  }

  public izbrisiModul() {
    if (this.inputModulIx != -1) {
      this.adminPodatkiStoritev
      .izbrisiModul(this.inputModul._id)
      .then(odgovor => {
        console.log("uspesno brisanje modula: ", this.inputModul.ime);
        // notify user
        this.formSuccess = true;
        this.formSuccessText = `Modul ${this.inputModul.ime} je bil uspešno izbrisan.`;
        // Vrze vn iz lista modulov na indeksu izbrisa
        this.moduli.splice(this.inputModulIx, 1);
        // Ta indeks se posodobi na veljaven indeks sele ko v seznamu kliknes na delete button
        this.inputModulIx = -1;
        setTimeout( () => { this.activeModal.close(); }, 1000 );
      });
    } else {
      // Modul ne obstaja (več) zato prikazi opozorilo
      this.formWarning = true;
      this.formWarningText = `Modul z imenom ${this.inputModul.ime} ne obstaja.`;
    }
  }

  public izvediAkcijo(akcija: string) {
    switch (akcija) {
      case 'Dodajanje modula':
        this.dodajNovModul();
        break;

      case 'Brisanje modula':
        this.izbrisiModul();
        break;

      case 'Posodabljanje modula':
        this.posodobiModul();
        break;

    }
  }

  // Preveri ce je ime zasedeno
  private imeZasedeno(ime: string) {
    if (this.moduli.some(el => el.ime === ime)) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
  }

}
