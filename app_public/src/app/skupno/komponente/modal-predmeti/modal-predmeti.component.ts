import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Modul } from '../../razredi/modul';
import { Osebje } from '../../razredi/osebje';
import { Predmet, ListPredmet } from '../../razredi/predmet';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
import { PovezavaService } from '../../storitve/povezava.service';
@Component({
  selector: 'app-modal-predmeti',
  templateUrl: './modal-predmeti.component.html'
})
export class ModalPredmetiComponent implements OnInit {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    public activeModal: NgbActiveModal,
    private povezavaStoritev: PovezavaService
  ) { }

  public noviPredmet: Predmet = {
    _id: '',
    ime: '',
    opis: '',
    letnik: 0,
    semester: 1,
    profesorji: [],
    asistenti: [],
    moduli: [],
    vrstaIzbirnega: 0,
    gradiva: []
  }

  
  @Input() modalTitle: string; 
  moduli: Modul[]; 
  osebje: Osebje[];
  predmeti: ListPredmet[];
  @Input() new: boolean;
  @Input() delete: boolean;
  @Input() update: boolean;
  @Input() submitButton: string;
  @Input() inputPredmet: Predmet;
  @Input() inputPredmetIx: number;
  @Input() referencaNaStariPredmet: Predmet;

  formWarning: boolean = false;
  formSuccess: boolean = false;
  formWarningText: string;
  formSuccessText: string;

  public izvediAkcijo(akcija: string) {
    switch (akcija) {
      case 'Dodajanje predmeta':
        this.dodajNovPredmet();
        break;

      case 'Brisanje predmeta':
        this.izbrisiPredmet();
        break;

      case 'Posodabljanje predmeta':
        this.posodobiPredmet();
        break;

    }
  }


  private dodajNovPredmet() {
    // Input checking, ce so izpolnjena vsa polja dodaj, drugace prikazi warning
    const imeZasedeno = this.imeZasedeno(this.noviPredmet.ime);
    if (this.noviPredmet.ime == '' || this.noviPredmet.profesorji.length == 0 || imeZasedeno) {
      this.formWarning = true;
      imeZasedeno ? this.formWarningText =  `Predmet z imenom ${this.noviPredmet.ime} že obstaja` : this.formWarningText = "Ime predmeta in profesor sta zahtevana podatka.";
    } else {
      this.adminPodatkiStoritev
        .dodajPredmet(this.noviPredmet)
        .then( dodaniPredmet => {
          console.log("dodan predmet ", dodaniPredmet);
          // Posodobi seznam, dodaj na konec(unshift za navrh seznama)
          this.predmeti.push(dodaniPredmet);
          // prikazi obvestilo
          this.formSuccess = true;
          this.formSuccessText = `Predmet ${this.noviPredmet.ime} je bil uspešno dodan.`;
          setTimeout( () => { this.activeModal.close(); }, 1000 );
        });
    }
  }

  private posodobiPredmet() {
    if (this.noviPredmet.ime == '' || this.noviPredmet.profesorji.length == 0) {
      // Obvesti admina v primeru da ne poda imena predmeta ali vsaj 1 profesorja
      this.formWarning = true;
      this.formWarningText = "Ime predmeta in profesor sta zahtevana podatka.";
    } else if (this.vsebujeDeleted(this.noviPredmet.profesorji) || this.vsebujeDeleted(this.noviPredmet.asistenti) || this.vsebujeDeleted(this.noviPredmet.moduli)) {
      // Obvesti admina da ponovno vpisuje v bazo referenco na osebje/modul ki ne obstaja več..naj jo odstrani
      // Tole je lazy fix, treba bi blo ob izbrisu osebe/modula loopat cez predmete in odstranit iz arrayev
      this.formWarning = true;
      this.formWarningText = "\"deleted\" označuje profesorja oz. modul ki ne obstaja več. Pred posodobitvijo je potrebno to referenco ročno odstraniti.";

    } else {
      this.adminPodatkiStoritev
        .posodobiPredmet(this.noviPredmet, this.noviPredmet._id)
        .then( posodobljeniPredmet => {
          console.log("Predmet posodobljen ", posodobljeniPredmet);
          // Posodobi frontend
          if (this.inputPredmetIx) this.predmeti[this.inputPredmetIx] = posodobljeniPredmet;
          if (this.referencaNaStariPredmet) {
            for(var property in this.referencaNaStariPredmet) this.referencaNaStariPredmet[property] = this.noviPredmet[property];
          }
          // prikazi obvestilo
          this.formSuccess = true;
          this.formSuccessText = `Predmet ${this.noviPredmet.ime} je bil uspešno posodobljen.`;
          setTimeout( () => { this.activeModal.close(); }, 1000 );
        });
    }
  }

  private izbrisiPredmet() {
    if (this.inputPredmetIx != -1 && this.noviPredmet.ime == this.inputPredmet.ime) {
      this.adminPodatkiStoritev
      .izbrisiPredmet(this.inputPredmet._id)
      .then(odgovor => {
        console.log("uspesno brisanje predmeta: ", this.inputPredmet.ime);
        // notify user
        this.formSuccess = true;
        this.formSuccessText = `Predmet ${this.inputPredmet.ime} je bil uspešno izbrisan.`;
        // Vrze vn iz lista predmetov na indeksu izbrisa
        this.predmeti.splice(this.inputPredmetIx, 1);
        // Ta indeks se posodobi na veljaven indeks sele ko v seznamu kliknes na delete button
        this.inputPredmetIx = -1;
        setTimeout( () => { this.activeModal.close(); }, 1000 );
      });
    } else {
      // predmet ne obstaja (več) zato prikazi opozorilo                                                            // vneseno napacno ime
      this.inputPredmetIx == -1 ? this.formWarningText = `Predmet z imenom ${this.inputPredmet.ime} ne obstaja.`: this.formWarningText = `Vnešeno ime predmeta se ne ujema.`; 
      this.formWarning = true;
    }
  }

   ///////////////////// DODAJANJE PROF/ASISTENTOV V LIST  /////////////////////
  public dodajElement(event: any, tip: number) {
    // tip == 0 -> profesor, tip == 1-> asistent, tip == 3 -> modul
    if (tip < 0 || tip > 2) return;
    // Ce se clicked datalist element ujema z enim ki obstaja v seznamu potem dodaj v seznam novih
    // Potrebno ker se klice ob spremembi in kdaj dobis tudi empty string
    let noviEl: any = this.checkIfInListAndReturn(event.target.value , tip == 0 || tip == 1 ? this.osebje: this.moduli, this.mapTipIntoAttribute(tip));
    if (noviEl) {
      if (tip == 0) {
        this.noviPredmet.profesorji.push(noviEl);
      } else if ( tip == 1) {
        this.noviPredmet.asistenti.push(noviEl);
      } else {
        this.noviPredmet.moduli.push(noviEl);
      }
    }
  }

  public izbrisiElement(ix: number, tip: number) {
    // tip == 0 -> profesor, tip == -> asistent, tip == 3 -> modul
    if (tip < 0 || tip > 2) return;
    if (tip == 0) {
      this.noviPredmet.profesorji.splice(ix, 1);
    } else if ( tip == 1) {
      this.noviPredmet.asistenti.splice(ix, 1);
    } else {
      this.noviPredmet.moduli.splice(ix, 1);
    }
  }

  // Za module in osebje preslika stevilko v atribut k ga rabis
  private mapTipIntoAttribute(tip: number) {
    if (tip == 0 || tip == 1) return 'ime_priimek';
    if (tip == 2) return 'ime';
    return null;
  }

  // Preveri ce se "el" nahaja v "array"-u na nekem mestu in se ujema v "lastnosti"
  private checkIfInListAndReturn(el: any, array: any, atribut: string) {
    for(var i = 0; i < array.length; i++) {
      if (array[i][atribut] === el) {
          return array[i];
      }
    }
    return null;
  }


  // Dropdowns //
  public nastaviLetnik(letnik: number) {
  this.noviPredmet.letnik = letnik;
  }
  public nastaviSemester(semester: number) {
    this.noviPredmet.semester = semester;
  }
  public nastaviTip(tip: number) {
    this.noviPredmet.vrstaIzbirnega = tip;
  }

  // Preveri ce je ime zasedeno
  private imeZasedeno(ime: string): boolean {
    if (this.predmeti.some(el => el.ime === ime)) {
      return true;
    }
    return false;
  }

  // Preveri ce predmet vsebuje kaksn "deleted" element
  private vsebujeDeleted(arr): boolean {
    if (arr.find(el => el._id === "-1")) {
      return true;
    }
    return false;
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  ngOnInit(): void {
    if (!this.predmeti) 
      this.pridobiPredmete();
    
    if (!this.osebje)
      this.pridobiOsebje();
      
    if (!this.moduli)
      this.pridobiModule();
  }

  // pridobi seznam osebja iz API-ja za prikaz, klice se na zacetku
  private pridobiOsebje() : void {
    this.adminPodatkiStoritev
      .pridobiOsebje()
      .then( pridobljenoOsebje => {this.osebje = pridobljenoOsebje});
  }
  
  // pridobi seznam modulov iz API-ja za prikaz, klice se na zacetku
  private pridobiModule() : void {
    this.adminPodatkiStoritev
      .pridobiModule()
      .then( pridobljeniModuli => this.moduli = pridobljeniModuli);
  }

  // pridobi seznam modulov iz API-ja za prikaz, klice se na zacetku
  private pridobiPredmete() : void {
    this.adminPodatkiStoritev
      .pridobiPredmete()
      .then( pridobljeniPredmeti => this.predmeti = pridobljeniPredmeti);
  }
}
