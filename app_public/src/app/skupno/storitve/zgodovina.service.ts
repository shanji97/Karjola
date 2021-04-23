import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ZgodovinaService {

  private urlNaslovi: string[] = [];
  constructor(private usmerjevalnik: Router) {
    this.usmerjevalnik.events
      .pipe(filter(dogodekUsmerjanja => dogodekUsmerjanja instanceof NavigationEnd))
      .subscribe((dogodekUsmerjanja: NavigationEnd) => {
        const url = dogodekUsmerjanja.urlAfterRedirects;
        this.urlNaslovi = [...this.urlNaslovi, url];
      })
  }
  //filters last urls without the unwanted ones -> navigation back
  public vrniPredhodnjeUrlNaslove(): string {
    const dolzina = this.urlNaslovi.length;
    return dolzina > 1 ? this.urlNaslovi[dolzina - 2] : '/';
  }
  //filters last urls without the unwanted ones -> navigation back
  public vrniPredhodnjeUrlNasloveBrezIzbranih(): string {
    const izloci: string[] = ['/registracija', '/prijava', '/obnoviGeslo','/vnesiNovoGeslo/:eposta', '/uporabniki/:idUporabnika', ];
    const filtrirano = this.urlNaslovi.filter(url => !izloci.includes(url));
    const dolzina = filtrirano.length;
    return dolzina > 1 ? filtrirano[dolzina - 1] : '/';
  }

}
