import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatStepper } from '@angular/material/stepper';
import { ModalController, PickerController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, AfterViewInit {
  defaultColumnOptions = [['Dog', 'Cat', 'Bird', 'Lizard', 'Chinchilla']];

  multiColumnOptions = [
    ['Minified', 'Responsive', 'Full Stack', 'Mobile First', 'Serverless'],
    ['Tomato', 'Avocado', 'Onion', 'Potato', 'Artichoke'],
  ];
  numOpts = [5, 5];
  @ViewChild('inputPassword') passwordInput: MatInput;
  @ViewChild('stepperComp') stepperComp: MatStepper;
  shows: BehaviorSubject<boolean> = new BehaviorSubject(false);
  pseudo: string = '';
  step: number = 0;
  sex: string = '';
  poids: number = 50;
  taille: number = 120;
  disabled = true;
  activitesList: any;
  physicalParam = {
    poids: 50,
    taille: 120,
  };

  stepperEvent: StepperSelectionEvent = new StepperSelectionEvent();

  constructor(
    public zone: NgZone,
    public modalCtl: ModalController,
    public picker: PickerController
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtl.dismiss();
  }

  ngAfterViewInit() {
    console.log(
      this.stepperComp?.selectionChange.subscribe((r) => {
        this.stepperEvent = r;
        console.log(r, this.pseudo);
        if (r.previouslySelectedIndex == 1 && this.pseudo != '') {
          console.log('augmente');
          this.step += 0.25;
        } else if (r.previouslySelectedIndex == 2 && this.sex != '') {
          this.step += 0.25;
        } else if (
          r.previouslySelectedIndex == 3 &&
          this.physicalParam.taille != 0 &&
          this.physicalParam.poids != 0
        ) {
          this.step += 0.25;
        }
        if (r) {
          this.zone.run(() => {
            this.shows.next(true);
          });
        }
      })
    );
  }

  change(ev) {
    console.log(ev);
  }

  physicParam(ev) {
    if (ev['poids']) {
      this.physicalParam.poids = ev.poids;
      console.log('poids');
    } else {
      this.physicalParam.taille = ev.taille;
      console.log('taille');
    }
    console.log(this.physicalParam);
  }

  choiceSex(event) {
    console.log(event);
    this.sex = event;
  }

  eventActivite(event) {
    console.log('ici', event);
    this.activitesList = event;
  }

  validate() {
    if (this.activitesList) {
      this.step += 0.25;
    }
  }
}
