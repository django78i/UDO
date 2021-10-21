import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activites',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  listActivites: any = [];
  value: any;

  constructor(private modalCtr: ModalController) { }

  ngOnInit() {
    const current = JSON.parse(localStorage.getItem('activite'));
    this.listActivites = [
      {
        id: 1, name: 'Athlétisme', nombres: 40, children: [
          { image: 'assets/images/icon1.svg', checked: false, name: 'Power lifting', width: '27px', height: '24px', padding: '11px 10px' },
          { image: 'assets/images/icon2.svg', checked: false, name: 'Bench press', width: '27px', height: '22px', padding: '11px 10px' },
          { image: 'assets/images/icon3.svg', checked: false, name: 'Abdominaux', width: '20px', height: '19px', padding: '12px 14px' },
          { image: 'assets/images/icon4.svg', checked: false, name: 'Cordes', width: '25px', height: '22px', padding: '11px 10px' },
          { image: 'assets/images/icon5.svg', checked: false, name: 'Souplesse', width: '20px', height: '25px', padding: '9px 13px' },
          { image: 'assets/images/icon6.svg', checked: false, name: 'Vélo elliptique', width: '21px', height: '26px', padding: '9px 14px' },
          { image: 'assets/images/icon7.svg', checked: false, name: 'Tapis de course', width: '23px', height: '25px', padding: '9px 14px' }]
      },

      {
        id: 2, name: 'Natation', nombres: 15, children:
          [{ image: 'assets/images/icon1.svg', checked: false, name: 'Power lifting', width: '27px', height: '24px', padding: '11px 10px' },
            { image: 'assets/images/icon2.svg', checked: false, name: 'Bench press', width: '27px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon3.svg', checked: false, name: 'Abdominaux', width: '20px', height: '19px', padding: '12px 14px' },
            { image: 'assets/images/icon4.svg', checked: false, name: 'Cordes', width: '25px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon5.svg', checked: false, name: 'Souplesse', width: '20px', height: '25px', padding: '9px 13px' },
            // eslint-disable-next-line max-len
            { image: 'assets/images/icon6.svg', checked: false, name: 'Vélo elliptique', width: '21px', height: '26px', padding: '9px 14px' },
            // eslint-disable-next-line max-len
            { image: 'assets/images/icon7.svg', checked: false, name: 'Tapis de course', width: '23px', height: '25px', padding: '9px 14px' }]
      }
      , {
        id: 3, name: 'Handisport', nombres: 8, children:
          [
            { image: 'assets/images/icon1.svg', checked: false, name: 'Power lifting', width: '27px', height: '24px', padding: '11px 10px' },
            { image: 'assets/images/icon2.svg', checked: false, name: 'Bench press', width: '27px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon3.svg', checked: false, name: 'Abdominaux', width: '20px', height: '19px', padding: '12px 14px' },
            { image: 'assets/images/icon4.svg', checked: false, name: 'Cordes', width: '25px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon5.svg', checked: false, name: 'Souplesse', width: '20px', height: '25px', padding: '9px 13px' },
            { image: 'assets/images/icon6.svg', checked: false, name: 'Vélo elliptique', width: '21px', height: '26px', padding: '9px 14px' },
            { image: 'assets/images/icon7.svg', checked: false, name: 'Tapis de course', width: '23px', height: '25px', padding: '9px 14px' }]
      },
      {
        id: 4, name: 'Football', nombres: 3, children:
          [
            { image: 'assets/images/icon1.svg', checked: false, name: 'Power lifting', width: '27px', height: '24px', padding: '11px 10px' },
            { image: 'assets/images/icon2.svg', checked: false, name: 'Bench press', width: '27px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon3.svg', checked: false, name: 'Abdominaux', width: '20px', height: '19px', padding: '12px 14px' },
            { image: 'assets/images/icon4.svg', checked: false, name: 'Cordes', width: '25px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon5.svg', checked: false, name: 'Souplesse', width: '20px', height: '25px', padding: '9px 13px' },
            { image: 'assets/images/icon6.svg', checked: false, name: 'Vélo elliptique', width: '21px', height: '26px', padding: '9px 14px' },
            { image: 'assets/images/icon7.svg', checked: false, name: 'Tapis de course', width: '23px', height: '25px', padding: '9px 14px' }]
      },
      {
        id: 5, name: 'Basketball', nombres: '3', children:
          [
            { image: 'assets/images/icon1.svg', checked: false, name: 'Power lifting', width: '27px', height: '24px', padding: '11px 10px' },
            { image: 'assets/images/icon2.svg', checked: false, name: 'Bench press', width: '27px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon3.svg', checked: false, name: 'Abdominaux', width: '20px', height: '19px', padding: '12px 14px' },
            { image: 'assets/images/icon4.svg', checked: false, name: 'Cordes', width: '25px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon5.svg', checked: false, name: 'Souplesse', width: '20px', height: '25px', padding: '9px 13px' },
            { image: 'assets/images/icon6.svg', checked: false, name: 'Vélo elliptique', width: '21px', height: '26px', padding: '9px 14px' },
            { image: 'assets/images/icon7.svg', checked: false, name: 'Tapis de course', width: '23px', height: '25px', padding: '9px 14px' }
          ]
      },
      {
        id: 6, name: 'Musculation', nombres: 35, children:
          [
            { image: 'assets/images/icon1.svg', checked: false, name: 'Power lifting', width: '27px', height: '24px', padding: '11px 10px' },
            { image: 'assets/images/icon2.svg', checked: false, name: 'Bench press', width: '27px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon3.svg', checked: false, name: 'Abdominaux', width: '20px', height: '19px', padding: '12px 14px' },
            { image: 'assets/images/icon4.svg', checked: false, name: 'Cordes', width: '25px', height: '22px', padding: '11px 10px' },
            { image: 'assets/images/icon5.svg', checked: false, name: 'Souplesse', width: '20px', height: '25px', padding: '9px 13px' },
            { image: 'assets/images/icon6.svg', checked: false, name: 'Vélo elliptique', width: '21px', height: '26px', padding: '9px 14px' },
            { image: 'assets/images/icon7.svg', checked: false, name: 'Tapis de course', width: '23px', height: '25px', padding: '9px 14px' }
          ]
      }];
    for(const item of this.listActivites){
      for(const activite of item.children){
        if(activite!=null && current!=null){
          if(activite?.name === current?.name){
            activite.checked = true;
          }
        }
      }
    }
  }

  iconWork(id: string) {
    const icon1 = document.getElementById(id);
    icon1.style.display = 'none';

    const icon2 = document.getElementById(id + 'icon2');
    icon2.style.display = 'block';
    this.value = id + 'icon2';

  }

  revIconWork(id: string) {
    const icon1 = document.getElementById(id);
    icon1.style.display = 'block';

    const icon2 = document.getElementById(id + 'icon2');
    icon2.style.display = 'none';
    this.value = id;

  }

  async close() {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  checkActivite(item) {
    localStorage.setItem('activite', JSON.stringify(item));
  }
}
