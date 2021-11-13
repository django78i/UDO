import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonInput, IonTextarea, ModalController } from '@ionic/angular';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AddContenuComponent } from 'src/app/session-now/add-contenu/add-contenu.component';
import { PhotoDetailComponent } from '../photo-detail/photo-detail.component';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss'],
})
export class DetailPostComponent implements OnInit {
  @Input() post: any;
  @Input() user: any;
  segmentValue = 'resume';
  message: any;
  tableReactions: any[] = [];
  picture: any;

  @ViewChild('texArea') textArea: IonInput;

  constructor(
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public champService: ChampionnatsService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    // console.log(this.post, this.user);
    const users = JSON.parse(localStorage.getItem('usersList'));
    console.log(users, this.post);
    this.post.reactions.map((react) => {
      if (react.users.length) {
        react.users.map((user) => {
          console.log(user);
          const userFind = users.find((us) => user.uid == us.uid);
          console.log(userFind);
          this.tableReactions.push({
            icon: react.icon,
            text: react.text,
            user: userFind,
            date: user.date,
          });
        });
      }
    });
    console.log(this.tableReactions);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(ev) {
    console.log(ev);
    this.segmentValue = ev.detail.value;
    this.ref.detectChanges();
  }

  send() {
    const message = {
      text: this.message,
      date: new Date(),
      sender: this.user,
      image: this.picture ? this.picture : '',
    };

    this.champService.sendMessage(message, this.post);
    this.message = '';
    this.picture = null;
  }

  async addContenu() {
    console.log('addContenu');
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      this.picture = data.data != 'Modal Closed' ? data.data : null;
    });
    return await modal.present();
  }

  async detailPhoto(photo) {
    const modal = await this.modalController.create({
      component: PhotoDetailComponent,
      showBackdrop: false,
      cssClass: 'deatilPhoto',
      componentProps: {
        photo: photo,
      },
    });
    return await modal.present();
  }

  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.picture = theActualPicture;
  }

}
