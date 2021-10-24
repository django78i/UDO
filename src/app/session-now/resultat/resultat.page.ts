import { Component, OnInit } from '@angular/core';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import { ModalController } from '@ionic/angular';
import { Camera ,CameraOptions} from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.page.html',
  styleUrls: ['./resultat.page.scss'],
})
export class ResultatPage implements OnInit {
  activite:any;
  listElement:any;
  now;
  isPicture:boolean = true;
  commentaire="";
  listNotif:any = [
    {img:"assets/images/personn.png",nombre:"70",name:"Bernard",comment:"Lorem ipsum dolor sit atmet",date:"Il y a 1 min.",icon:"assets/images/Blush.png"},
    {img:"assets/images/personn2.PNG",nombre:"10",name:"Mélanie",comment:"Lorem ipsum dolor sit atmet",date:"Il y a 1 min.",icon:"assets/images/ThumbsUp.png"},
  ]
  constructor(private modalCtrl:ModalController,private router:Router, private camera:Camera) { 
  
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4].slice(0,5);
    }, 1);
  }

  ngOnInit() {
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.listElement = JSON.parse(localStorage.getItem('choix'));
  }

  publier(){
    if(this.isPicture){
      this.donneesPrive();
    }else{
      this.addContenu();
    }
  }

  async addContenu() {
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
     
    });
    return await modal.present();

  }
  async donneesPrive() {
    const modal = await this.modalCtrl.create({
      component: DonneesPriveComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
     
    });
    return await modal.present();

  }

  openCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
}
