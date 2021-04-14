import { Component, OnInit } from '@angular/core';
import { SidebarPodatkiService } from '../../storitve/sidebar-podatki.service';
import { NavElement } from '../../razredi/nav-element';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public podatki: NavElement[];

  constructor(
    private sidebarPodatkiStoritev: SidebarPodatkiService
  ) { }

  ngOnInit() {
    this.sidebarPodatkiStoritev
      .pridobiSidebar()
      .then(sidebar => {
        this.podatki = sidebar;
      })
      .catch(napaka => this.podatki = []);
  }
}
