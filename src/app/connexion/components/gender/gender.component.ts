import {
  AfterViewInit,
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
export class GenderComponent implements OnInit, AfterViewInit {
  icons = ['femme', 'homme', 'multi', 'autres'];

  @Output() choix: EventEmitter<string> = new EventEmitter();

  @ViewChildren('sex') sex: QueryList<ElementRef>;
  @ViewChildren('svgGender') svgGender: QueryList<ElementRef>;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.sex);
  }

  choice(index) {
    this.sex.forEach((r, i) => {
      if (i === index) {
        r.nativeElement.style.background = 'blue';
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
    this.choix.emit(this.icons[index]);
  }
}
