import { Component, OnInit } from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {
  listActivite = [{name:'Corps haut',value:'20',image:'assets/images/corps-haut.svg'},
    {name:'Corps bas',value:'100',image:'assets/images/corps-bas.svg'},
    {name:'Cardio',value:'20',image:'assets/images/cardio.svg'},
    {name:'Explosivité',value:'20',image:'assets/images/explosivite.svg'},
    {name:'Souplesse',value:'20',image:'assets/images/souplesse.svg'},
    {name:'Gainage',value:'20',image:'assets/images/gainage.svg'}];
  constructor(private router: Router,private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
     // this.presentAlertConfirm();
    });

    const activite = JSON.parse(localStorage.getItem('activite'));
    if(activite){
      this.listActivite = activite.details;
    }
  }

  ngOnInit() {
  }
  fermer(){
    this.router.navigate(['tabs']);
  }

}
