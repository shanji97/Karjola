import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GradivoPodatkiService } from '../../storitve/gradivo-podatki.service';
import { GradivoForm, Gradivo } from '../../razredi/gradivo';
import { ActivatedRoute } from '@angular/router';
import { Predmet } from '../../razredi/predmet';

@Component({
  selector: 'app-gradivo-upload',
  templateUrl: './gradivo-upload.component.html',
  styleUrls: ['./gradivo-upload.component.css']
})
export class GradivoUploadComponent implements OnInit {
  gradivoDodano: boolean = false;
  obaPrisotna: boolean = false;
  uploadNapaka: boolean = false;

  constructor(
    private gradivoPodatkiService: GradivoPodatkiService
  ) { }

  @Input() predmet: Predmet;
  @Output() nalozi: EventEmitter<Gradivo> = new EventEmitter<Gradivo>();

  datoteka: File = null;
  povezava: string;

  ngOnInit(): void {
  }

  getFile(files: File[]): void {
    if (!files || files.length > 0)
      this.datoteka = null;
    
    this.datoteka = files[0];
  }

  preveriPravilnost(): void {
    if (this.datoteka && this.povezava)
      this.obaPrisotna = true;
    else
      this.obaPrisotna = false;
  }

  naloziGradivo(): void {
    this.preveriPravilnost();

    if (!this.obaPrisotna) {
      var gradivoForm: GradivoForm;

      if (this.datoteka) {
        gradivoForm = {
          predmet: this.predmet._id,
          datoteka: this.datoteka
        };
      }
      else {
        gradivoForm = {
          predmet: this.predmet._id,
          povezava: new URL(this.povezava)
        };
      }
      
      this.datoteka = null;
      this.povezava = "";
      
      this.gradivoPodatkiService.naloziGradivo(gradivoForm)
        .then(gradivo => this.nalozi.emit(gradivo))
        .catch(_ => this.uploadNapaka = true);
    }
  }
}
