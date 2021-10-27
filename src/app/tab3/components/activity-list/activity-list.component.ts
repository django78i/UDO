import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  activites: any[] = [
    // {
    //   nom: 'Athlétisme',
    //   nbActivites: 40,
    //   ssActivites: [
    //     { isChecked: false, nom: 'Saut en hauteur' },
    //     { isChecked: false, nom: '100m' },
    //     { isChecked: false, nom: '200m' },
    //     { isChecked: false, nom: 'Saut en longueur' },
    //   ],
    //   all: false,
    // },
    // {
    //   nom: 'Natation',
    //   nbActivites: 12,
    //   ssActivites: [
    //     { isChecked: false, nom: 'libre' },
    //     { isChecked: false, nom: '4 x 100m' },
    //     { isChecked: false, nom: 'crawl' },
    //   ],
    //   all: false,
    // },
    // {
    //   nom: 'Handisport',
    //   nbActivites: 12,
    //   ssActivites: [
    //     { isChecked: false, nom: 'libre' },
    //     { isChecked: false, nom: '4 x 100m' },
    //     { isChecked: false, nom: 'crawl' },
    //   ],
    //   all: false,
    // },
    // {
    //   nom: 'Football',
    //   nbActivites: 12,
    //   ssActivites: [
    //     { isChecked: false, nom: 'libre' },
    //     { isChecked: false, nom: '4 x 100m' },
    //     { isChecked: false, nom: 'crawl' },
    //   ],
    //   all: false,
    // },
    // {
    //   nom: 'BasketBall',
    //   nbActivites: 12,
    //   ssActivites: [
    //     { isChecked: false, nom: 'libre' },
    //     { isChecked: false, nom: '4 x 100m' },
    //     { isChecked: false, nom: 'crawl' },
    //   ],
    //   all: false,
    // },
  ];
  activities$: Observable<any>;
  activitesSub$: Subject<any[]> = new BehaviorSubject(null);
  choix: any[] = [];
  @Output() activitesEvent: EventEmitter<any> = new EventEmitter();
  @Output() backAction: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    // this.activitesSub$.next(this.activites);
    // this.activites$ = this.activitesSub$.pipe(
    //   tap((activites) => {
    //     console.log(activites);
    //   })
    // );
    this.activities$ = this.http
      .get<any[]>('../../../assets/mocks/activitiesList.json')
      .pipe(
        map((act) => {
          let activiteFil = [];
          const activities = act;
          activities.map((ac) => {
            let table = [];
            const ssActTable = ac.sousAcitivite.map((ssAct) => {
              return {
                ...ssAct,
                isChecked: false,
              };
            });
            table.push(ssActTable);
            activiteFil.push({
              ...ac,
              sousAcitivite: ssActTable,
              all: false,
              // active: true,
            });
          });
          return activiteFil;
        })
      );
    this.activities$.subscribe((act) => (this.activites = act));
  }

  back() {
    this.backAction.emit(true);
  }

  activate(index) {
    this.activites[index].active
      ? (this.activites[index].active = !this.activites[index].active)
      : (this.activites[index].active = true);
    this.ref.detectChanges();
  }

  all(event) {
    console.log(event);
  }

  selectAll(index) {
    let indexChoisi;
    this.activites[index].sousAcitivite.forEach((act) => {
      act.isChecked = !this.activites[index].all;
    });
    this.ref.detectChanges();
  }

  change(event, i, j, categ) {
    console.log(event, this.activites[i].sousAcitivite[j].isChecked, categ);
    if (categ.isChecked == true) {
      this.choix.push(categ.nom);
    } else {
      const indCategorieInTable = this.choix.findIndex((r) => r == categ.nom);
      indCategorieInTable != -1
        ? this.choix.splice(indCategorieInTable, 1)
        : '';
    }
    console.log(this.choix);
    this.activitesEvent.emit(this.choix);
  }
}
