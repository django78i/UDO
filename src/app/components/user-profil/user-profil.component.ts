import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent implements OnInit, AfterViewInit {
  @ViewChildren('hexagon') hexagon: QueryList<ElementRef>;
  @ViewChildren('points') points: QueryList<ElementRef>;
  @ViewChild('stat') stat: ElementRef;

  doneesIniitial = [
    {
      postion: {
        x: 10,
        y: 60,
      },
      vecteur: {
        x: -100,
        y: 50,
      },
    },
    {
      postion: {
        x: 120,
        y: 10,
      },
      vecteur: {
        x: 0,
        y: 110,
      },
    },
    {
      postion: {
        x: 210,
        y: 60,
      },
      vecteur: {
        x: 100,
        y: 50,
      },
    },
    {
      postion: {
        x: 210,
        y: 160,
      },
      vecteur: {
        x: 100,
        y: -50,
      },
    },
    {
      postion: {
        x: 110,
        y: 220,
      },
      vecteur: {
        x: 0,
        y: -110,
      },
    },
    {
      postion: {
        x: 10,
        y: 160,
      },
      vecteur: {
        x: -100,
        y: -50,
      },
    },
  ];

  ratio = [1, 0.8, 0.6, 0.4, 0.2];

  stats: number[] = [800, 500, 100, 100, 100, 200];
  max = 1000;
  donneeFormat: any[] = [];
  seg: string = 'résumé';
  statTable = [];
  position: string;
  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.createGraph();
    this.position = this.createStats();
    console.log(this.position);
  }

  ngAfterViewInit() {
    this.hexagon.map((hex, indice) => {
      const position = `${this.donneeFormat[indice][0].x},${this.donneeFormat[indice][0].y} ${this.donneeFormat[indice][1].x},${this.donneeFormat[indice][1].y} ${this.donneeFormat[indice][2].x},${this.donneeFormat[indice][2].y} ${this.donneeFormat[indice][3].x},${this.donneeFormat[indice][3].y} ${this.donneeFormat[indice][4].x},${this.donneeFormat[indice][4].y} ${this.donneeFormat[indice][5].x},${this.donneeFormat[indice][5].y}`;
      hex.nativeElement.setAttribute('points', position);
      indice == 0 ? hex.nativeElement.style.strokeWidth= "2px" : hex.nativeElement.style.strokeWidth= "1px";
    });
    this.points.map((hex, indice) => {
      hex.nativeElement.setAttribute('cx', this.statTable[indice].x);
      hex.nativeElement.setAttribute('cy', this.statTable[indice].y);
    });
    this.stat.nativeElement.setAttribute('points', this.position);
  }

  close() {
    this.modalController.dismiss();
  }

  createStats() {
    let table: any[] = [];
    this.stats.map((stat, i) => {
      const ratio = stat / this.max;
      console.log(ratio, this.doneesIniitial[i].vecteur.x * ratio);
      const position = {
        x: 110 - this.doneesIniitial[i].vecteur.x * ratio,
        y: 110 - this.doneesIniitial[i].vecteur.y * ratio,
      };
      this.statTable.push(position);
    });
    let position;
    return (position = `${this.statTable[0].x},${this.statTable[0].y} ${this.statTable[1].x},${this.statTable[1].y} ${this.statTable[2].x},${this.statTable[2].y} ${this.statTable[3].x},${this.statTable[3].y} ${this.statTable[4].x},${this.statTable[4].y} ${this.statTable[5].x},${this.statTable[5].y}`);
  }

  createGraph() {
    this.ratio.map((ratio) => {
      const format = this.doneesIniitial.map((vecteur) => {
        const ratioVecteur = {
          x: vecteur.vecteur.x * ratio,
          y: ratio * vecteur.vecteur.y,
        };
        const svgPos = {
          x: 110 - ratioVecteur.x,
          y: 110 - ratioVecteur.y,
        };
        console.log(ratioVecteur, svgPos);
        return svgPos;
      });
      console.log(format);
      this.donneeFormat.push(format);
    });
    console.log(this.donneeFormat);
  }
}
