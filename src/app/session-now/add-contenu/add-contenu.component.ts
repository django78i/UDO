import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType} from '@capacitor/camera';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-contenu',
  templateUrl: './add-contenu.component.html',
  styleUrls: ['./add-contenu.component.scss'],
})
export class AddContenuComponent implements OnInit {
  isPicture = true;
  base64: any;
  constructor(private modalCtr: ModalController) { }

  ngOnInit() {}

  async close() {
    const closeModal = 'Modal Closed';
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
