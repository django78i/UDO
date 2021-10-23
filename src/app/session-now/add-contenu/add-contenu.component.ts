import { Component, OnInit } from '@angular/core';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contenu',
  templateUrl: './add-contenu.component.html',
  styleUrls: ['./add-contenu.component.scss'],
})
export class AddContenuComponent implements OnInit {
  isPicture:boolean = true;
  constructor(private modalCtr:ModalController,private router:Router, private camera:Camera) { }

  ngOnInit() {}

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
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
