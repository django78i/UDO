import {
  Component,
  ElementRef,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss'],
})
export class GenderComponent implements OnInit {
  icons = [ 'homme','femme', 'multi', 'autres'];

  @Output() choix: EventEmitter<string> = new EventEmitter();

  @ViewChildren('sex') sex: QueryList<ElementRef>;
  @ViewChildren('type') type: QueryList<ElementRef>;
  @ViewChildren('image') image: QueryList<ElementRef>;
  @ViewChildren('svgGender') svgGender: QueryList<ElementRef>;
  constructor() {}

  ngOnInit() {}


  choice(index,type) {
    this.sex.forEach((r, i) => {
      if (i === index) {
        r.nativeElement.style.background = '#2F3033';
      } else {
        r.nativeElement.style.background = 'white';
      }
    });
    this.svgGender.forEach((r, i) => {
      if (i === index) {
        r.nativeElement.style.fill = 'white';
      } else {
        r.nativeElement.style.fill = 'black';
      }
    });
    this.type.forEach((r, i) => {
      if (i === index) {
        r.nativeElement.style.color = 'white';
      } else {
        r.nativeElement.style.color = '#000000';
      }
    });
    this.image.forEach((r, i) => {
      if (i === index) {
        this.icons[i]=this.icons[i]+"-white";
        
      } else {
        if(this.icons[i].endsWith('-white')){
        this.icons[i]=this.icons[i].replace('-white','');
        }else{
          this.icons[i]=this.icons[i];
        }
      }
    });

    this.choix.emit(this.icons[index]);
  }
}
