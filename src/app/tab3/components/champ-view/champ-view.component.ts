import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CompetitionsListComponent } from 'src/app/components/competitions-list/competitions-list.component';

@Component({
  selector: 'app-champ-view',
  templateUrl: './champ-view.component.html',
  styleUrls: ['./champ-view.component.scss'],
})
export class ChampViewComponent implements OnInit {
  @Input() userChampionnats: any[];
  @Input() championnatsList: any[];
  @Input() champinonatNetwork: any[];

  @Output() champChoice: EventEmitter<any> = new EventEmitter();
  @Output() createChamp: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router, public modalController: ModalController) {}

  ngOnInit() {}

  async launchDetail(ev) {
    this.champChoice.emit(ev);
    // this.router.navigate([`/championnat/${ev.uid}`]);
  }

  buttonClick() {
    this.createChamp.emit();
  }

  async openCompetitionList() {
    const modal = await this.modalController.create({
      component: CompetitionsListComponent,
      componentProps: {
        segmentSelected: 'championnats',
      },
    });
    return await modal.present();
  }
}
