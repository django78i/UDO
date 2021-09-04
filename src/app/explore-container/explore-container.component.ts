import { Component, OnInit, Input } from '@angular/core';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  constructor(private videoPlayer: VideoPlayer) { }

  ngOnInit() {

  }


  play() {
    this.videoPlayer.play('file:///android_asset/www/movie.mp4').then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });

  }
}
