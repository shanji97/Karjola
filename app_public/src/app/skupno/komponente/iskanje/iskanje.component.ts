import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Gradivo } from '../../razredi/gradivo';
import { Osebje } from '../../razredi/osebje';
import { Predmet } from '../../razredi/predmet';
import { IskanjeService } from '../../storitve/iskanje.service';
import { PovezavaService } from '../../storitve/povezava.service';
import { OsebjeComponent } from '../osebje/osebje.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { Location } from '@angular/common';

@Component({
  selector: 'app-iskanje',
  templateUrl: './iskanje.component.html',
  styleUrls: ['./iskanje.component.css']
})
export class IskanjeComponent implements OnInit {


  constructor(
    private pot: ActivatedRoute,
    private iskanjeStoritev: IskanjeService,
    private modalService: NgbModal,
    private povezavaStoritev: PovezavaService,
    private location: Location,
    private router: Router
  ) { }
  //filtriranje
  predmetiFilter: boolean = true;
  osebjeFilter: boolean = true;
  //pagination
  page = 1;
  pageSize =10;
  vseh;


  iskalniIzraz: string;
  zadetki: any[] = [];
  /*
  gradiva: Gradivo[];
  predmeti: Predmet[];
  osebje: Osebje[];
  */

  public sporociloNapaka: string;

  public openOsebje(osebaId?: string) {
    var modalContext = this.modalService.open(OsebjeComponent, {centered: true, size: 'md'}).componentInstance;
    modalContext.idInput = osebaId;
  }

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public onPageChange(pageNum: number): void {
    this.page = pageNum;
    this.iskanje();
  }

  public iskanje(): void {
    var url: string = this.generirajUrl();
    this.iskanjeStoritev.pridobiZadetke(url).then( zadetki => {
      this.zadetki = zadetki['zadetki'];
      this.vseh = zadetki['vseh'];
      this.location.go('iskanje?'+ url);
      console.log(zadetki);
    })
      .catch(napaka => this.sporociloNapaka = napaka);
  }

  private generirajUrl(): string{
    return this.iskanjeStoritev.generirajUrlZaPoizvedbo(this.iskalniIzraz, this.predmetiFilter, this. osebjeFilter, this.pageSize, (this.page-1)*this.pageSize);
  }


  ngOnInit() {
    //pridobi iskalniIzraz iz parametrov ko klices iz glave...Ostali parametri so ze v te komponenti nastavljeni po default
    this.pot.queryParams
      .subscribe(params => {
        this.iskalniIzraz = params['iskalniIzraz'];
        if (!this.iskalniIzraz)
          this.iskalniIzraz = "";
        this.iskanje();
    })
  }


}
