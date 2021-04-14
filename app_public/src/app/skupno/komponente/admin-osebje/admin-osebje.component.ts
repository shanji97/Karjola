import { Component, Input, OnInit } from '@angular/core';
import { Osebje } from '../../razredi/osebje';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOsebjeComponent } from '../modal-osebje/modal-osebje.component';
import { PovezavaService } from '../../storitve/povezava.service';
@Component({
  selector: 'app-admin-osebje',
  templateUrl: './admin-osebje.component.html',
  styleUrls: ['./admin-osebje.component.css']
})
export class AdminOsebjeComponent implements OnInit {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    private modalService: NgbModal,
    private povezavaStoritev: PovezavaService
  ) { }

  @Input() osebje: Osebje[];

  ///////////////////// MODALNA OKNA /////////////////////
  public openModal(tip: string, oseba?: Osebje, ix?: number) {
    var modalContext = this.modalService.open(ModalOsebjeComponent, {centered: true, size: 'md'}).componentInstance;
    modalContext.osebje = this.osebje;

    switch (tip) {
      case 'new':
        modalContext.modalTitle = 'Dodajanje osebe';
        modalContext.new = true;
        modalContext.submitButton = 'Ustvari osebo';
        break;

      case 'delete':
        modalContext.modalTitle = 'Brisanje osebe';
        modalContext.delete = true;
        modalContext.inputOseba = oseba;
        modalContext.inputOsebaIx = ix;
        modalContext.submitButton = 'Izbriši osebo';
        break;

      case 'update':
        const kopijaOsebe: Osebje = JSON.parse(JSON.stringify(oseba));
        modalContext.modalTitle = 'Posodabljanje osebe';
        modalContext.update = true;
        modalContext.inputOseba = kopijaOsebe;
        modalContext.inputOsebaIx = ix;
        modalContext.submitButton = 'Posodobi osebo';
        break;

      default:
        console.log("Ta akcija za modalno okno pri osebju ne obstaja");
        break;
    }
  }

  formWarning: boolean = false;
  formSuccess: boolean = false;
  deleteNotification: boolean = false;

  izbrisani: string;
  // opcije v <select> za naziv
  akademskiNazivi: string[] = ['brez','asistent','docent','profesor'];
  // ngModel
  public novoOsebje: Osebje = {
    _id : '',
    ime_priimek : '',
    akademskiNaziv: '',
    izobrazba: '',
    e_mail: '',
    opis: ''
  };

  // Klice se ob submitu forma
  public dodajNovoOsebje() {
    // Input checking, ce so izpolnjena vsa polja dodaj, drugace prikazi warning
    if (this.novoOsebje.ime_priimek == '' || this.novoOsebje.akademskiNaziv == '' || this.novoOsebje.izobrazba == '' || this.novoOsebje.opis == '') {
      this.formWarning = true;
    } else {
      console.log("vse ok");
      this.adminPodatkiStoritev
        .dodajOsebje(this.novoOsebje)
        .then( dodanoOsebje => {
          console.log("dodano osebje ", dodanoOsebje);
          // Posodobi seznam, dodaj na konec(unshift za navrh seznama)
          let novoOsebje = this.osebje.slice(0);
          novoOsebje.push(dodanoOsebje);
          this.osebje = novoOsebje;
          // prikazi obvestilo
          this.formSuccess = true;
        });
    }
  }

  // Ob kliku na trash can
  public izbrisiOsebje(idOsebe: string, index: number) {
    this.adminPodatkiStoritev
      .izbrisiOsebje(idOsebe)
      .then(odgovor => {
        // notify user
        this.izbrisani = this.osebje[index].ime_priimek;
        this.deleteNotification = true;
        let novoOsebje = this.osebje.slice(0);
        // Vrze vn iz lista osebje na indeksu izbrisa
        novoOsebje.splice(index, 1);
        this.osebje = novoOsebje;
      });
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }


  ngOnInit() {
  }

}
