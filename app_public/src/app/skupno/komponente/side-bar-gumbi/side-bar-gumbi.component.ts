import { Component, OnInit, Input } from '@angular/core';
import { NavElement } from '../../razredi/nav-element';

@Component({
  selector: 'app-side-bar-gumbi',
  templateUrl: './side-bar-gumbi.component.html',
  styleUrls: ['./side-bar-gumbi.component.css']
})
export class SideBarGumbiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  prikaziPodmeni: boolean = false;

  @Input() data: NavElement;
  @Input() level: Number;
}
