import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUsmerjanjeModule } from './moduli/app-usmerjanje/app-usmerjanje.module';
import { OgrodjeComponent } from './skupno/komponente/ogrodje/ogrodje.component';
import { GlavaComponent } from './skupno/komponente/glava/glava.component';
import {GradivoUploadComponent} from './skupno/komponente/gradivo-upload/gradivo-upload.component';
import { SideBarComponent } from './skupno/komponente/side-bar/side-bar.component';
import { DomacaStranComponent } from './skupno/komponente/domaca-stran/domaca-stran.component';
import { RegistracijaComponent } from './skupno/komponente/registracija/registracija.component';
import { PrijavaComponent } from './skupno/komponente/prijava/prijava.component';
import { VnesiNovoGesloComponent } from './skupno/komponente/vnesi-novo-geslo/vnesi-novo-geslo.component';
import { ObnoviGesloComponent } from './skupno/komponente/obnovi-geslo/obnovi-geslo.component'; 
import { IskanjeComponent } from './skupno/komponente/iskanje/iskanje.component';
import { PodatkovnaBazaComponent } from './skupno/komponente/podatkovna-baza/podatkovna-baza.component';
import { SplosniPogojiComponent } from './skupno/komponente/splosni-pogoji/splosni-pogoji.component';
import { PotrditevObnoveGeslaComponent } from './skupno/komponente/potrditev-obnove-gesla/potrditev-obnove-gesla.component';
import { UporabnikComponent } from './skupno/komponente/uporabnik/uporabnik.component';
import { AdminComponent } from './skupno/komponente/admin/admin.component';
import { AdminOsebjeComponent } from './skupno/komponente/admin-osebje/admin-osebje.component';
import { GradivoComponent } from './skupno/komponente/gradivo/gradivo.component';
import { PredmetComponent } from './skupno/komponente/predmet/predmet.component';
import { OsebjeNastavitveComponent } from './skupno/komponente/osebje-nastavitve/osebje-nastavitve.component';
import { AdminPredmetiComponent } from './skupno/komponente/admin-predmeti/admin-predmeti.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalPredmetiComponent } from './skupno/komponente/modal-predmeti/modal-predmeti.component';
import { ModalModuliComponent } from './skupno/komponente/modal-moduli/modal-moduli.component';
import { AdminModuliComponent } from './skupno/komponente/admin-moduli/admin-moduli.component';
import { SideBarGumbiComponent } from './skupno/komponente/side-bar-gumbi/side-bar-gumbi.component';
import { ModalOsebjeComponent } from './skupno/komponente/modal-osebje/modal-osebje.component';
import { OsebjeComponent } from './skupno/komponente/osebje/osebje.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {KomentarComponent} from './skupno/komponente/komentar/komentar.component'
import {PredmetGradivaComponent} from './skupno/komponente/predmet-gradiva/predmet-gradiva.component'
import {NovKomentarComponent} from './skupno/komponente/nov-komentar/nov-komentar.component'
import { VelikostDatotekePipe } from './skupno/pipes/velikost-datoteke.pipe';
import { FormatirajLetnikPipe } from './skupno/pipes/formatiraj-letnik.pipe';
import { FormatirajSemesterPipe } from './skupno/pipes/formatiraj-semester.pipe';
import { FormatirajTipIzbirnegaPipe } from './skupno/pipes/formatiraj-tip-izbirnega.pipe';
import { CasOddajePipe } from './skupno/pipes/cas-oddaje.pipe';

@NgModule({
  declarations: [
      //Komponente
      GlavaComponent,
      IskanjeComponent,
      OgrodjeComponent,
      DomacaStranComponent,
      SideBarComponent,
      IskanjeComponent,
      SplosniPogojiComponent,
      PodatkovnaBazaComponent,

      PrijavaComponent,
      RegistracijaComponent,
      ObnoviGesloComponent,
      VnesiNovoGesloComponent,
      PotrditevObnoveGeslaComponent,
      UporabnikComponent,
      OsebjeNastavitveComponent,

      AdminComponent,
      AdminOsebjeComponent,

      GradivoComponent,
      GradivoUploadComponent,

      PredmetComponent,
      AdminPredmetiComponent,
      ModalPredmetiComponent,
      ModalModuliComponent,
      AdminModuliComponent,
      SideBarGumbiComponent,
      ModalOsebjeComponent,
      OsebjeComponent,
      PredmetGradivaComponent,
      
      KomentarComponent,
      NovKomentarComponent,
      
      VelikostDatotekePipe,
      FormatirajLetnikPipe,
      FormatirajSemesterPipe,
      FormatirajTipIzbirnegaPipe,
      CasOddajePipe
  ],
  imports: [
    
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppUsmerjanjeModule,
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [ModalPredmetiComponent],
  providers: [],
  bootstrap: [OgrodjeComponent],
  entryComponents: [ModalPredmetiComponent]
})
export class AppModule { }
