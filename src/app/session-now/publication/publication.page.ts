import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {
  listActivite = [{name:'Corps haut',value:'20',image:'assets/images/corps-haut.svg'},{name:'Corps bas',value:'100',image:'assets/images/corps-bas.svg'},{name:'Cardio',value:'20',image:'assets/images/cardio.svg'},{name:'Explosivité',value:'20',image:'assets/images/explosivite.svg'},{name:'Souplesse',value:'20',image:'assets/images/souplesse.svg'},{name:'Gainage',value:'20',image:'assets/images/gainage.svg'}]
  constructor() {
    let activite = JSON.parse(localStorage.getItem('activite'));
    if(activite){
      this.listActivite = activite.details;
    }
  }

  ngOnInit() {
  }
  fermer(){
    
  }

}
