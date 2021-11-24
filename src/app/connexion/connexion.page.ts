import {
  AfterContentChecked,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ModalController, NavController, IonSlides } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ConnexionChoiceComponent } from './components/connexion-choice/connexion-choice.component';
import { LoginModalComponent } from './components/login-modal/login/login-modal.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit, AfterContentChecked {
  @ViewChild('slider') sliderComp: IonSlides;
  config: SwiperOptions = {
    slidesPerView: 1,
  };
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
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
  modeClasse = "slideDemarrage";
  currentIndex = 0;
  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;

  constructor(
    public modalController: ModalController,
    public navController: NavController
  ) {
  }

  ngOnInit() { }

  ngAfterContentChecked(): void {
    // if (this.swiper) {
    //   this.swiper.map((swip) => swip.updateSwiper({}));
    // }
  }

  openConnect() {
    this.navController.navigateForward('login');
  }
  async change(event) {
    this.currentIndex = await this.sliderComp.getActiveIndex();
  }
  // async openConnect() {
  //   const modal = await this.modalController.create({
  //     component: ConnexionChoiceComponent,
  //   });
  //   return await modal.present();
  // }

  getColor(index) {
    switch (index) {
      case 0:
        return '#352D8F';
      case 1:
        return '#1F88F2';
      case 2:
        return '#121214';
      case 3:
        return '#4E31AD';
    }
  }
}
