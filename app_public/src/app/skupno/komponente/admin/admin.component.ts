import { Component, OnInit } from '@angular/core';
import { Modul } from '../../razredi/modul';
import { Osebje } from '../../razredi/osebje';
import { Predmet, ListPredmet } from '../../razredi/predmet';
import { AdminPodatkiService } from '../../storitve/admin-podatki.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService,
    private avtentikacijaStoritev: AvtentikacijaService,
    private povezavaStoritev: PovezavaService
  ) { }

  osebje: Osebje[];
  predmeti: ListPredmet[];
  moduli: Modul[];
  admin: boolean;
  public sporociloNapaka: string;

  // preveri ce je uporabnik prijavljen in če je admin
  private jeAdmin(): void {
    this.admin = this.avtentikacijaStoritev.jeAdmin()
  }

  // pridobi seznam osebja iz API-ja za prikaz, klice se na zacetku
  private pridobiOsebje() : void {
    this.adminPodatkiStoritev
      .pridobiOsebje()
      .then( pridobljenoOsebje => {this.osebje = pridobljenoOsebje;})
      .catch(napaka => this.sporociloNapaka = napaka);
  }

  // pridobi seznam predmetov iz API-ja za prikaz, klice se na zacetku
  private pridobiPredmete() : void {
    this.adminPodatkiStoritev
      .pridobiPredmete()
      .then( pridobljeniPredmeti => this.predmeti = pridobljeniPredmeti)
      .catch(napaka => this.sporociloNapaka = napaka);
  }

  // pridobi seznam modulov iz API-ja za prikaz, klice se na zacetku
  private pridobiModule() : void {
    this.adminPodatkiStoritev
      .pridobiModule()
      .then( pridobljeniModuli => this.moduli = pridobljeniModuli)
      .catch(napaka => this.sporociloNapaka = napaka);
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }


  ngOnInit() {
    this.jeAdmin();
    if (this.admin) {
      this.pridobiOsebje();
      this.pridobiPredmete();
      this.pridobiModule();
    }
  }

}
