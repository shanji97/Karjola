import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdminPodatkiService } from './admin-podatki.service';
import { Modul } from '../razredi/modul';
import { Predmet, ListPredmet } from '../razredi/predmet';
import { NavMeni, NavElement, NavLink } from '../razredi/nav-element';

@Injectable({
  providedIn: 'root'
})
export class SidebarPodatkiService {

  constructor(
    private adminPodatkiStoritev: AdminPodatkiService
  ) { }

  public pridobiSidebar(): Promise<NavElement[]> {
    return Promise.all<ListPredmet[], Modul[]>([
      this.adminPodatkiStoritev.pridobiPredmete(),
      this.adminPodatkiStoritev.pridobiModule()
    ]).then(podatki => {
      var predmeti: ListPredmet[] = podatki[0];
      var moduli: Modul[] = podatki[1];

      return this.generirajSidebar(predmeti, moduli);
    });
  }

  private najdiLetnike(predmeti: ListPredmet[]): SidebarLetnik[] {
    var letniki: SidebarLetnik[] = [];
    for (let predmet of predmeti) {
        let letnik = letniki.find(letnik => letnik.zaporednaSt == predmet.letnik);
        if (letnik) {
          letnik.predmeti.push(predmet);
        }
        else if (predmet.letnik && predmet.letnik > 0) {
          letniki.push({
              zaporednaSt: predmet.letnik,
              predmeti: [predmet]
          });
        }
    }

    return letniki;
  }

  private napolniModule(predmeti: ListPredmet[], moduli: Modul[]): SidebarModul[] {
    console.log(predmeti);
    console.log(moduli);
    var moduliSPredmeti: SidebarModul[] = moduli.map(modul => {
      return {
          id: modul._id,
          ime: modul.ime,
          predmeti: []
      };
    });

    for (let predmet of predmeti) {
      if (predmet.moduli) {
        let modul: SidebarModul = moduliSPredmeti
          .find(modul => predmet.moduli.some(predMod => predMod == modul.id));
        if (modul)
          modul.predmeti.push(predmet);
      }
    }

    return moduliSPredmeti;
  }

  private sidebarPredmet(predmet: ListPredmet): NavElement {
    return new NavLink({
      id: predmet._id,
      naziv: predmet.ime
    });
  }

  private sidebarModul(modul: SidebarModul) : NavElement {
    var prviSemester: NavElement = this.sidebarSemester(modul.predmeti, 1);
    var drugiSemester: NavElement = this.sidebarSemester(modul.predmeti, 2);

    var fields: NavElement[] = [];
    if (prviSemester)
      fields.push(prviSemester);
    
    if (drugiSemester)
      fields.push(drugiSemester);

    return new NavMeni({
      naziv: modul.ime,
      fields: fields
    });
  }

  private sidebarLetnik(letnik: SidebarLetnik): NavElement {
    var prviSemester = this.sidebarSemester(letnik.predmeti, 1);
    var drugiSemester = this.sidebarSemester(letnik.predmeti, 2);

    var fields = [];
    if (prviSemester)
      fields.push(prviSemester);

    if (drugiSemester)
      fields.push(drugiSemester);

    return new NavMeni({
      naziv: `${letnik.zaporednaSt}. letnik`,
      fields: fields
    });
  }

  private sidebarIzbirni(predmeti: ListPredmet[], vrsta: number): NavElement[] {
    var strokovniPredmeti: ListPredmet[] = predmeti.filter(predmet => predmet.vrstaIzbirnega == vrsta);
    var prviSemester = this.sidebarSemester(strokovniPredmeti, 1);
    var drugiSemester = this.sidebarSemester(strokovniPredmeti, 2);

    var fields = [];
    if (prviSemester)
      fields.push(prviSemester);

    if (drugiSemester)
      fields.push(drugiSemester);

    return fields;
  }

  private sidebarSemester(predmeti : ListPredmet[], semester : number): NavElement {
    var semesterPredmeti : ListPredmet[] = predmeti.filter(predmet => predmet.semester == semester);
    if (semesterPredmeti.length > 0)
      return new NavMeni({
        naziv: `${semester}. semester`,
        fields: semesterPredmeti.map(predmet => this.sidebarPredmet(predmet))
      });
    
    return null;
  }

  private generirajSidebar(predmeti: ListPredmet[], moduli: Modul[]): NavElement[] {
    var sidebar : NavMeni[] = [];

    var letniki = this.najdiLetnike(predmeti).sort((p1, p2) => p1.zaporednaSt - p2.zaporednaSt);
    var moduliSPredmeti = this.napolniModule(predmeti, moduli).filter(modul => modul.predmeti.length > 0);
    
    var sidebarLetniki = letniki.map(letnik => this.sidebarLetnik(letnik));
    if (sidebarLetniki.length > 0)
      sidebar.push(...sidebarLetniki);

    var sidebarModuli = moduliSPredmeti.map(modul => this.sidebarModul(modul));
    if (sidebarModuli.length > 0)
      sidebar.push(new NavMeni({
          naziv: 'Moduli',
          fields: sidebarModuli
      }));

    var sidebarSplosni = this.sidebarIzbirni(predmeti, 1);
    if (sidebarSplosni.length > 0)
      sidebar.push(new NavMeni({
          naziv: "Splošni izbirni predmeti",
          fields: sidebarSplosni
      }));

    var sidebarStrokovni = this.sidebarIzbirni(predmeti, 2);
    if (sidebarStrokovni.length > 0)
      sidebar.push(new NavMeni({
          naziv: "Strokovni izbirni predmeti",
          fields: sidebarStrokovni
      }));

    return sidebar;
  }
}

interface SidebarLetnik {
  zaporednaSt: number;
  predmeti: ListPredmet[];
}

interface SidebarModul {
  id: string;
  ime: string;
  predmeti: ListPredmet[];
}
