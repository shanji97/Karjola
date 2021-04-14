import { Component, OnInit } from '@angular/core';
import { Predmet } from '../../razredi/predmet';
import { PredmetPodatkiService } from '../../storitve/predmet-podatki.service';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPredmetiComponent } from '../modal-predmeti/modal-predmeti.component';
import { OsebjeComponent } from '../osebje/osebje.component';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';

@Component({
  selector: 'app-predmet',
  templateUrl: './predmet.component.html',
  styleUrls: ['./predmet.component.css']
})
export class PredmetComponent implements OnInit {
  predmet: Predmet;
  jeAdmin: boolean;

  public sporociloNapaka: string;

  constructor(
    private predmetPodatkiService: PredmetPodatkiService,
    private adminPodatkiStoritev: AdminPodatkiService,
    private authStoritev: AvtentikacijaService,
    private modalService: NgbModal,
    private pot: ActivatedRoute
  ) { }

  // pridobi seznam predmetov iz API-ja za prikaz, klice se na zacetku
  private pridobiPredmetNaTemNaslovu() : void {
    this.pot.paramMap
    .pipe(
      switchMap((params: ParamMap) => {
        let idPredmeta = params.get('idPredmeta');
        return this.predmetPodatkiService.pridobiPredmetById(idPredmeta);
      })
    )
    .subscribe((predmet: Predmet) => {
      this.predmet = predmet;
      console.log(this.predmet);
    });
  }


  ///////////////////// MODALNA OKNA /////////////////////
  public openModal(tip: string, predmet?: Predmet, ix?: number) {
    const noviPredmet: Predmet = JSON.parse(JSON.stringify(predmet));
    var modalContext = this.modalService.open(ModalPredmetiComponent, {centered: true, size: 'md'}).componentInstance;
    
    switch (tip) {
      case 'update':
        modalContext.modalTitle = 'Posodabljanje predmeta';
        modalContext.update = true;
        modalContext.noviPredmet = noviPredmet;
        modalContext.referencaNaStariPredmet = predmet;
        modalContext.submitButton = 'Posodobi predmet'
        break;

      default:
        console.log("Ta akcija za modalno okno pri modulih ne obstaja");
        break;
    }
  }

  public openOsebje(osebaId?: string) {
    var modalContext = this.modalService.open(OsebjeComponent, {centered: true, size: 'md'}).componentInstance;
    modalContext.idInput = osebaId;
  }

  ngOnInit() {
    this.jeAdmin = this.authStoritev.jeAdmin();
    this.pridobiPredmetNaTemNaslovu();
  }

}
