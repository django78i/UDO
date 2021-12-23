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
import { MusicFeedService } from 'src/app/services/music-feed.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss'],
})
export class DetailPostComponent implements OnInit {
  @Input() post: any;
  @Input() user: any;
  @Input() segment: string;
  segmentValue = 'resume';
  message: any;
  tableReactions: any[] = [];
  picture: any;
  postList: any[] = [];
  @ViewChild('texArea') textArea: IonInput;

  constructor(
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public champService: ChampionnatsService,
    public modalController: ModalController,
    public feedService: MusicFeedService
  ) {}

  ngOnInit() {
    this.segmentValue = this.segment ? this.segment : 'resume';
    this.formatPost();
  }

  async formatPost() {
    this.post = await this.feedService.getPost(this.post.uid);
    this.post.user = this.findUser(this.post.userId);
    let table: any[] = [];
    this.post.reactions.map((react) => {
      if (react.users.length) {
        react.users.map((user) => {
          console.log(user);
          const userFind = this.findUser(user.uid);
          console.log(userFind);
          table.push({
            icon: react.icon,
            text: react.text,
            user: userFind,
            date: user.date,
          });
        });
      }
    });
    this.tableReactions = _.orderBy(table, ['date'], ['desc']);
    console.log(this.tableReactions, this.post);
  }

  findUser(uid) {
    const users = JSON.parse(localStorage.getItem('usersList'));
    return users.find((us) => uid == us.uid);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(ev) {
    console.log(ev);
    this.segmentValue = ev.detail.value;
    this.ref.detectChanges();
  }

  deletePhoto() {
    this.picture = null;
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
}
