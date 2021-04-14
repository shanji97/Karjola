import { Component, Input, OnInit } from '@angular/core';
import { Modul } from '../../razredi/modul';
import { Osebje } from '../../razredi/osebje';
import { Predmet } from '../../razredi/predmet';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
// modal windows
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPredmetiComponent } from '../modal-predmeti/modal-predmeti.component';
import { PovezavaService } from '../../storitve/povezava.service';
@Component({
  selector: 'app-admin-predmeti',
  templateUrl: './admin-predmeti.component.html',
  styleUrls: ['./admin-predmeti.component.css']
})
export class AdminPredmetiComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private adminPodatkiStoritev: AdminPodatkiService,
    private povezavaStoritev: PovezavaService
  ) { }
  
  @Input() predmeti: Predmet[];
  @Input() osebje: Osebje[];
  @Input() moduli: Modul[];


   ///////////////////// MODALNA OKNA /////////////////////
   public openModal(tip: string, predmet?: Predmet, ix?: number) {
    var modalContext = this.modalService.open(ModalPredmetiComponent, {centered: true, size: 'md'}).componentInstance;
    modalContext.predmeti = this.predmeti;

    switch (tip) {
      case 'new':
        modalContext.modalTitle = 'Dodajanje predmeta';
        modalContext.new = true;
        modalContext.osebje = this.osebje;
        modalContext.moduli = this.moduli;
        modalContext.submitButton = 'Ustvari predmet'
        break;
      
      case 'delete':
        modalContext.modalTitle = 'Brisanje predmeta';
        modalContext.delete = true;
        modalContext.inputPredmet = predmet;
        modalContext.inputPredmetIx = ix;
        modalContext.submitButton = 'Potrdi'
        break

      case 'update': 
        modalContext.modalTitle = 'Posodabljanje predmeta';
        modalContext.update = true;
        modalContext.osebje = this.osebje;
        modalContext.moduli = this.moduli;
        modalContext.noviPredmet = this.adminPodatkiStoritev.idArrayIntoObjectArray(predmet, this.osebje, this.moduli);
        modalContext.inputPredmetIx = ix;
        modalContext.submitButton = 'Posodobi predmet'
        break;

      default:
        console.log("Ta akcija za modalno okno pri predmetih ne obstaja");
        break;
    }
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  ngOnInit(): void {
  }

}
