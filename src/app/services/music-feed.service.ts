import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicFeedService {

  currentPlay$: Subject<boolean> = new Subject;

  constructor(public router: Router) {

  }
}
