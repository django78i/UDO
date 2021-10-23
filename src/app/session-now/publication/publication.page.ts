import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {
  listActivite = [{name:'Corps haut',nombre:'20',image:'assets/images/corps-haut.svg'},{name:'Corps bas',nombre:'100',image:'assets/images/corps-bas.svg'},{name:'Cardio',nombre:'20',image:'assets/images/cardio.svg'},{name:'Explosivité',nombre:'20',image:'assets/images/explosivite.svg'},{name:'Souplesse',nombre:'20',image:'assets/images/souplesse.svg'},{name:'Gainage',nombre:'20',image:'assets/images/gainage.svg'}]
  constructor() { }

  ngOnInit() {
  }
  fermer(){
    
  }

}
