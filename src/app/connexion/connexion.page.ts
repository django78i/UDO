import {
  AfterContentChecked,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { LoginModalComponent } from './components/login-modal/login/login-modal.component';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit, AfterContentChecked {
  config: SwiperOptions = {
    slidesPerView: 1,
  };

  sliders = [
    {
      titre: 'Interconnectivité',
      description:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
      image: '../assets/banner/interconnectivite.svg',
      background: '#3161F0',
    },
    {
      titre: 'Compétitions',
      description:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
      image: '../assets/banner/competition.png',
      background: '#E25454',
    },
    {
      titre: 'Invitez vos amis',
      description:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
      image: '../assets/banner/amis.png',
      background: '#5340BC',
    },
  ];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;

  constructor(
    public modalController: ModalController,
    public navController: NavController
  ) {}

  ngOnInit() {}

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map((swip) => swip.updateSwiper({}));
    }
  }

  openConnect() {
    this.navController.navigateForward('connexion/login');
  }
}
