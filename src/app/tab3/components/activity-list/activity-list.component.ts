import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  @Output() backAction: EventEmitter<any> = new EventEmitter();

  masterCheck: boolean = false;
  activites: any[] = [
    {
      nom: 'Athlétisme',
      nbActivites: 40,
      ssActivites: [
        { isChecked: false, nom: 'Saut en hauteur' },
        { isChecked: true, nom: '100m' },
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

  constructor() {}

  ngOnInit() {
    this.activitesSub$.next(this.activites);
    this.activites$ = this.activitesSub$.pipe(
      tap((activites) => {
        console.log(activites);
      })
    );
  }

  back() {
    this.backAction.emit(true);
  }

  activate(index) {
    this.activites[index].active
      ? (this.activites[index].active = !this.activites[index].active)
      : (this.activites[index].active = true);
    console.log(this.activites[index].active);
  }

  all(event) {
    console.log(event);
  }

  selectAll(index) {
    let indexChoisi;
    indexChoisi = this.activites[index].ssActivites.forEach((act) => {
      act.isChecked = !this.activites[index].all;
    });
    this.activitesSub$.next(this.activites);
  }

  change(event) {
    console.log(event);
  }
}
