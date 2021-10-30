import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-accordeon',
  templateUrl: './accordeon.component.html',
  styleUrls: ['./accordeon.component.scss'],
})
export class AccordeonComponent implements OnInit {
  activites: any[] = [
    {
      nom: 'Athlétisme',
      nbActivites: 40,
      ssActivites: [
        { isChecked: false, nom: 'Saut en hauteur' },
        { isChecked: false, nom: '100m' },
        { isChecked: false, nom: '200m' },
        { isChecked: false, nom: 'Saut en longueur' },
      ],
      all: false,
    },
    {
      nom: 'Natation',
      nbActivites: 12,
      ssActivites: [
        { isChecked: false, nom: 'libre' },
        { isChecked: false, nom: '4 x 100m' },
        { isChecked: false, nom: 'crawl' },
      ],
      all: false,
    },
    {
      nom: 'Handisport',
      nbActivites: 12,
      ssActivites: [
        { isChecked: false, nom: 'libre' },
        { isChecked: false, nom: '4 x 100m' },
        { isChecked: false, nom: 'crawl' },
      ],
      all: false,
    },
    {
      nom: 'Football',
      nbActivites: 12,
      ssActivites: [
        { isChecked: false, nom: 'libre' },
        { isChecked: false, nom: '4 x 100m' },
        { isChecked: false, nom: 'crawl' },
      ],
      all: false,
    },
    {
      nom: 'BasketBall',
      nbActivites: 12,
      ssActivites: [
        { isChecked: false, nom: 'libre' },
        { isChecked: false, nom: '4 x 100m' },
        { isChecked: false, nom: 'crawl' },
      ],
      all: false,
    },
  ];
  activitesSub$: Subject<any[]> = new BehaviorSubject(null);
  activites$: Observable<any[]>;
  choix: any[] = [];
  @Output() activitesEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.activitesSub$.next(this.activites);
    this.activites$ = this.activitesSub$
  }

  activate(index) {
    this.activites[index].active
      ? (this.activites[index].active = !this.activites[index].active)
      : (this.activites[index].active = true);
  }

  all(event) {
  }

  selectAll(index) {
    let indexChoisi;
    indexChoisi = this.activites[index].ssActivites.forEach((act) => {
      act.isChecked = !this.activites[index].all;
    });
    this.activitesSub$.next(this.activites);
  }

  change(event, i, j, categ) {
    if (categ.isChecked == true) {
      this.choix.push(categ.nom);
    } else {
      const indCategorieInTable = this.choix.findIndex((r) => r == categ.nom);
      indCategorieInTable != -1
        ? this.choix.splice(indCategorieInTable, 1)
        : '';
    }
    this.activitesEvent.emit(this.choix);
  }
}
