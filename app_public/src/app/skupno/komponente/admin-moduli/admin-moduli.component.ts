import { Component, Input, OnInit } from '@angular/core';
import { Modul } from '../../razredi/modul';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalModuliComponent } from '../modal-moduli/modal-moduli.component';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-admin-moduli',
  templateUrl: './admin-moduli.component.html',
  styleUrls: ['./admin-moduli.component.css']
})
export class AdminModuliComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private povezavaStoritev: PovezavaService,
  ) { }
  @Input() moduli: Modul[];

  ///////////////////// MODALNA OKNA /////////////////////
  public openModal(tip: string, modul?: Modul, ix?: number) {
    var modalContext = this.modalService.open(ModalModuliComponent, {centered: true, size: 'md'}).componentInstance;
    modalContext.moduli = this.moduli;

    switch (tip) {
      case 'new':
        modalContext.modalTitle = 'Dodajanje modula';
        modalContext.new = true;
        modalContext.submitButton = 'Ustvari modul'
        break;
      
      case 'delete':
        modalContext.modalTitle = 'Brisanje modula';
        modalContext.delete = true;
        modalContext.inputModul = modul;
        modalContext.inputModulIx = ix;
        modalContext.submitButton = 'Izbriši modul'
        break

      case 'update': 
        modalContext.modalTitle = 'Posodabljanje modula';
        modalContext.update = true;
        modalContext.inputModul = modul;
        modalContext.inputModulIx = ix;
        modalContext.submitButton = 'Posodobi modul'
        break;

      default:
        console.log("Ta akcija za modalno okno pri modulih ne obstaja");
        break;
    }
  }

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }


  ngOnInit(): void {
  }

}
