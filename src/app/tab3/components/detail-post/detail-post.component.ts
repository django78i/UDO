import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonTextarea, ModalController } from '@ionic/angular';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  @ViewChild('texArea') textArea: IonTextarea;

  constructor(
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public champService: ChampionnatsService
  ) {}

  ngOnInit() {
    console.log(this.post, this.user);
    this.post.reactions.map((react) => {
      if (react.users.length) {
        react.users.map((user) => {
          this.tableReactions.push({
            icon: react.icon,
            user: user,
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
    this.champService.sendMessage(message, this.post.uid);
    this.message = '';
    this.picture = null;
    this.textArea.ionBlur;
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
