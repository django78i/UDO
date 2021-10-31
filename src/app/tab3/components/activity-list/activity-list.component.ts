import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
} from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit, OnDestroy {
  activites: any[] = [];
  activities$: Observable<any>;
  activitesSub$: Subject<any[]> = new BehaviorSubject(null);
  choix: any[] = [];
  subscription: Subscription;
  @Output() activitesEvent: EventEmitter<any> = new EventEmitter();
  @Output() backAction: EventEmitter<any> = new EventEmitter();
  @Input() header: boolean;

  constructor(public http: HttpClient, private ref: ChangeDetectorRef) {}

  ngOnInit() {
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
            });
          });
          return activiteFil;
        })
      );
    this.subscription = this.activities$.subscribe(
      (act) => (this.activites = act)
    );
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

  selectAll(index) {
    this.activites[index].sousAcitivite.forEach((act) => {
      act.isChecked = !this.activites[index].all;
    });
    this.ref.detectChanges();
  }

  change(categ) {
    console.log(categ);
    if (!categ.isChecked) {
      console.log('on push')
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
