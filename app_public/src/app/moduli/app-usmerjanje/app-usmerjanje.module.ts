import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DomacaStranComponent } from '../../skupno/komponente/domaca-stran/domaca-stran.component';
import { RegistracijaComponent } from '../../skupno/komponente/registracija/registracija.component';
import { PrijavaComponent } from '../../skupno/komponente/prijava/prijava.component';
import { VnesiNovoGesloComponent } from '../../skupno/komponente/vnesi-novo-geslo/vnesi-novo-geslo.component';
import { ObnoviGesloComponent } from '../../skupno/komponente/obnovi-geslo/obnovi-geslo.component';
import { IskanjeComponent } from '../../skupno/komponente/iskanje/iskanje.component';
import { PodatkovnaBazaComponent } from '../../skupno/komponente/podatkovna-baza/podatkovna-baza.component';
import { SplosniPogojiComponent } from '../../skupno/komponente/splosni-pogoji/splosni-pogoji.component';
import { PotrditevObnoveGeslaComponent } from '../../skupno/komponente/potrditev-obnove-gesla/potrditev-obnove-gesla.component';
import { UporabnikComponent } from '../../skupno/komponente/uporabnik/uporabnik.component';
import { AdminComponent } from '../../skupno/komponente/admin/admin.component';
import { AdminOsebjeComponent } from '../../skupno/komponente/admin-osebje/admin-osebje.component';
import { GradivoComponent } from '../../skupno/komponente/gradivo/gradivo.component';
import { PredmetComponent } from '../../skupno/komponente/predmet/predmet.component';
import { OsebjeNastavitveComponent } from '../../skupno/komponente/osebje-nastavitve/osebje-nastavitve.component';
import { OsebjeComponent } from '../../skupno/komponente/osebje/osebje.component';

const poti: Routes = [
  {
    path: '',
    component: DomacaStranComponent
  },{
    path: 'registracija',
    component: RegistracijaComponent
  }, {
    path: 'prijava',
    component: PrijavaComponent
  },{
    path: 'obnoviGeslo',
    component: ObnoviGesloComponent
  },{
    path: 'vnesiNovoGeslo/:eposta',
    component: VnesiNovoGesloComponent
  }, {
    path: 'db',
    component: PodatkovnaBazaComponent
  }, {
    path: 'splosniPogoji', // še naredim danes
    component: SplosniPogojiComponent
  }, {
    path: 'potrditevObnoveGesla',
    component: PotrditevObnoveGeslaComponent
  }, {
    path: 'uporabniki/:idUporabnika',
    component: UporabnikComponent
  }, {
    path: 'admin', 
    component: AdminComponent
  }, {
    path: 'admin/osebje',   
    component: AdminOsebjeComponent
  },{
    path: 'gradivo/:idGradiva',
    component: GradivoComponent
  },{
    path: 'predmeti/:idPredmeta',
    component: PredmetComponent
  },{
    path: 'osebje/:idOseba/nastavitve',
    component: OsebjeNastavitveComponent
  }, {
    path: 'osebje/:idOseba',
    component: OsebjeComponent
  }, {
    path: 'iskanje',
    component: IskanjeComponent
  },{
    path: '**',
    redirectTo: '/'
  }


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(poti)
  ],
  exports: [RouterModule]
})
export class AppUsmerjanjeModule { }
