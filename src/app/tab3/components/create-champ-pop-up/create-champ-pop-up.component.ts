import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  IonCheckbox,
  IonRange,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-create-champ-pop-up',
  templateUrl: './create-champ-pop-up.component.html',
  styleUrls: ['./create-champ-pop-up.component.scss'],
})
export class CreateChampPopUpComponent
  implements OnInit, AfterContentChecked, AfterViewInit
{
  formChamp: FormGroup;
  dataCount: number = 2;
  maxPlayer = false;
  ban: any = 'assets/banner/blackBanner.svg';
  title: BehaviorSubject<any> = new BehaviorSubject(null);
  @ViewChild('swiper') swiper: SwiperComponent;
  @Output() champ: EventEmitter<any> = new EventEmitter();

  bannieres = [
    {
      color: '#19191C',
      url: 'assets/banner/blackBanner.svg',
    },
    {
      color: '#EE2E6C',
      url: 'assets/banner/redBanner.svg',
    },
    {
      color: '#2DB681',
      url: 'assets/banner/greenBanner.svg',
    },
  ];

  config: SwiperOptions = {
    slidesPerView: 1,
    allowTouchMove: false,
  };
  range: any = { lower: 40, upper: 60 };
  loading = true;
  sliderPage: any;
  @ViewChildren('checkBanniere') checkBanniere: QueryList<IonCheckbox>;

  constructor(
    private modalCtrl: ModalController,
    public fb: FormBuilder,
    public popoverController: PopoverController,
    public elemRef: ElementRef
  ) {}

  ngOnInit() {
    this.initForm();
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngAfterViewInit() {
    const dualRange: any = document.querySelector('#dual-range');
    dualRange.value = { lower: 40, upper: 60 };
  }

  close() {
    this.modalCtrl.dismiss();
  }

  initForm() {
    this.formChamp = this.fb.group({
      name: [''],
    });
  }

  add() {
    this.dataCount += 1;
    console.log(this.dataCount);
  }

  sub() {
    if (this.dataCount != 0) {
      this.dataCount -= 1;
    } else {
      this.dataCount = this.dataCount;
    }
    console.log(this.dataCount);
  }

  change() {
    this.maxPlayer = !this.maxPlayer;
    console.log(this.maxPlayer);
  }

  getBan(ev) {
    console.log(ev);
    this.ban = ev;
  }

  onKey() {
    const val = this.formChamp.get('name').value;
    this.title.next(val);
  }

  slideNext(data) {
    console.log(this.swiper);
    this.sliderPage = data;
    // console.log(this.sliderPage);
    this.swiper.swiperRef.slideNext();
  }

  changement(ev) {
    this.range = ev.detail.value;
  }

  focused(ev, index) {
    const elemStyle = document.querySelectorAll('.checkZone');
    elemStyle.forEach((elem, i) => {
      console.log(elem);
      if (index === i) {
        console.log(index, i);
        elem.classList.add('check');
        console.log(elem)
      } else {
        console.log(index, i);
        elem.classList.remove('check');
      }
    });

    this.checkBanniere.map((ban, i) => {
      if (i != index) {
        ban.checked = false;
      }
    });
    console.log(this.checkBanniere, index);
    this.checkBanniere.get(index).checked.valueOf();
    console.log(this.checkBanniere.get(index));
    this.ban = ev;
  }

  backSlide(ev) {
    this.swiper.swiperRef.slidePrev();
  }

  afffich(ev) {
    console.log(ev);
  }
}
