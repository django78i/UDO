import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType} from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contenu',
  templateUrl: './add-contenu.component.html',
  styleUrls: ['./add-contenu.component.scss'],
})
export class AddContenuComponent implements OnInit {
  isPicture:boolean = true;
  base64:any;
  constructor(private modalCtr:ModalController,private router:Router) { }

  ngOnInit() {}

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  async openCamera(){
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });
  
    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64=theActualPicture;
    console.log('image',this.base64);
    
  
  }
}
