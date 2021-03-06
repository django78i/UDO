import {
	Component,
	ViewChildren,
	QueryList,
	ViewChild,
	Renderer2,
	ElementRef,
	AfterContentChecked,
	OnInit
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MusicFeedService } from '../services/music-feed.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';


@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterContentChecked {
	// feed = data;
	feed: Observable<any>;
	challenges: Observable<any>;
	@ViewChildren('player') videoPlayers: QueryList<any>;
	currentPlaying: HTMLVideoElement = null;

	stickyVideo: HTMLVideoElement = null;
	stickyPlaying = false;
	@ViewChild('stickyplayer', { static: false }) stickyPlayer: ElementRef;
	@ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
	@ViewChildren('swiper2') swiper2: QueryList<SwiperComponent>;

	config: SwiperOptions = {
		slidesPerView: 1.3,
		spaceBetween: 20,
	};
	config2: SwiperOptions = {
		slidesPerView: 3.1,
		spaceBetween: 10,
	};


	filters = [
		{
			icon: '',
			name: 'Récent'
		},
		{
			icon: '../../assets/icon/tendance.svg',
			name: 'Tendance'
		},
		{
			icon: '../../assets/icon/live.svg',
			name: 'En direct'
		},
		{
			icon: '../../assets/icon/friends.svg',
			name: 'Mes amis'
		},

	]


	value = 70;
	mode = "determinate";
	diameter = 70;
	color = "dark"
	soundMute = false;

	constructor(
		private renderer: Renderer2,
		public musService: MusicFeedService,
		public http: HttpClient,
		public navCtl: NavController
	) {

	}

	ngOnInit() {
		this.feed = this.http.get('../../assets/mocks/feed.json')
			.pipe(
				tap(r => console.log(r))
			);

		this.challenges = this.http.get('../../assets/mocks/challenges.json')
			.pipe(
				tap(r => console.log(r))
			);
		// this.challenges.subscribe()

		this.musService.currentPlay$.pipe(
			tap(r => {
				if (r == false && this.currentPlaying != null) {
					console.log(r);
					this.currentPlaying.pause();
					this.currentPlaying = null;
				}

			})
		).subscribe();
	}

	ngAfterContentChecked(): void {
		if (this.swiper) {
			this.swiper.map(swip => swip.updateSwiper({}));
		}
		if (this.swiper2) {
			this.swiper2.map(swip => swip.updateSwiper({}));
		}
	}

	sound() {
		this.soundMute = !this.soundMute;
		this.currentPlaying.muted = this.soundMute;
		console.log(this.currentPlaying.muted)
	}


	didScroll() {
		if (this.currentPlaying && this.isElementInViewport(this.currentPlaying)) {
			this.currentPlaying.muted = this.soundMute;
			return;
		} else if (this.currentPlaying && !this.isElementInViewport(this.currentPlaying)) {
			// Item is out of view, pause it
			this.currentPlaying.pause();
			this.currentPlaying = null;
		}

		this.videoPlayers.forEach(player => {
			if (this.currentPlaying) {
				// Skip all furhter players, we are already playing
				return;
			}

			// Check if the element is in our view
			const nativeElement = player.nativeElement;
			const inView = this.isElementInViewport(nativeElement);

			// Prevent playing the current sticky video in the feed
			if (this.stickyVideo && this.stickyVideo.src == nativeElement.src) {
				return;
			}

			// Start autoplay if it's in the view
			if (inView) {
				this.currentPlaying = nativeElement;
				this.currentPlaying.muted = false;
				this.currentPlaying.play();
				return;
			}
		});
	}

	// https://stackoverflow.com/questions/27427023/html5-video-fullscreen-onclick
	openFullscreen(elem) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitEnterFullscreen) {
			elem.webkitEnterFullscreen();
			elem.enterFullscreen();
		}
	}

	// Check if the element is visible in the view
	isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}


	nav() {
		this.navCtl.navigateForward('/tabs/tab3')
	}


}
