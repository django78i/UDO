import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CompetitionsListComponent } from 'src/app/components/competitions-list/competitions-list.component';

@Component({
  selector: 'app-chall-view',
  templateUrl: './chall-view.component.html',
  styleUrls: ['./chall-view.component.scss'],
})
export class ChallViewComponent implements OnInit {
  bannData: any;
  @Input() challenges: any[];
  @Input() challEncours: any[];
  @Output() createChall: EventEmitter<any> = new EventEmitter();
  @Output() challengeId: EventEmitter<any> = new EventEmitter();
  @Output() viewAllChall: EventEmitter<any> = new EventEmitter();


  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    // this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
    //   tap((r) => {
    //     this.bannData = r[0];
    //   })
    // );
  }

  buttonClick() {
    this.createChall.emit();
  }

  chooseChallenge(ev) {
    console.log(ev);
    this.challengeId.emit(ev);
  }

  async openCompetitionList() {
    this.viewAllChall.emit([])
    // const modal = await this.modalController.create({
    //   component: CompetitionsListComponent,
    //   componentProps : {
    //     segmentSelected : 'challenges'
    //   }
    // });
    // return await modal.present();
  }
}
