import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-param',
  templateUrl: './user-param.component.html',
  styleUrls: ['./user-param.component.scss'],
})
export class UserParamComponent implements OnInit, AfterViewInit {
  @ViewChildren('hexagon') hexagon: QueryList<ElementRef>;
  @ViewChildren('points') points: QueryList<ElementRef>;
  @ViewChild('stat') stat: ElementRef;

  doneesIniitial = [
    {
      postion: {
        x: 30,
        y: 90,
      },
      vecteur: {
        x: -100,
        y: 50,
      },
    },
    {
      postion: {
        x: 140,
        y: 40,
      },
      vecteur: {
        x: 0,
        y: 110,
      },
    },
    {
      postion: {
        x: 230,
        y: 90,
      },
      vecteur: {
        x: 100,
        y: 50,
      },
    },
    {
      postion: {
        x: 230,
        y: 190,
      },
      vecteur: {
        x: 100,
        y: -50,
      },
    },
    {
      postion: {
        x: 130,
        y: 250,
      },
      vecteur: {
        x: 0,
        y: -110,
      },
    },
    {
      postion: {
        x: 30,
        y: 190,
      },
      vecteur: {
        x: -100,
        y: -50,
      },
    },
  ];

  ratio = [1, 0.8, 0.6, 0.4, 0.2];
  statTable = [];
  donneeFormat: any[] = [];
  position: string;
  @Input() user: any;
  max: number;
  tableMetrics = [
    '../../assets/icon/metrics/corpshaut.svg',
    '../../assets/icon/metrics/corpsbas.svg',
    '../../assets/icon/metrics/souplesse.svg',
    '../../assets/icon/metrics/explosivite.svg',
    '../../assets/icon/metrics/cardio.svg',
    '../../assets/icon/metrics/gainage.svg',
  ];
  constructor() {}

  ngOnInit() {
    console.log(this.user);
    this.createGraph();
    const tableOrder = _.orderBy(this.user.metrics, ['value'], ['desc']);
    console.log(tableOrder);
    this.max = this.user.metrics ? Math.round(tableOrder[0].value * 1.2) : 0;
    this.position = this.createStats();
  }

  ngAfterViewInit() {
    console.log(this.user);
    this.hexagon.map((hex, indice) => {
      const position = `${this.donneeFormat[indice][0].x},${this.donneeFormat[indice][0].y} ${this.donneeFormat[indice][1].x},${this.donneeFormat[indice][1].y} ${this.donneeFormat[indice][2].x},${this.donneeFormat[indice][2].y} ${this.donneeFormat[indice][3].x},${this.donneeFormat[indice][3].y} ${this.donneeFormat[indice][4].x},${this.donneeFormat[indice][4].y} ${this.donneeFormat[indice][5].x},${this.donneeFormat[indice][5].y}`;
      hex.nativeElement.setAttribute('points', position);
      indice == 0
        ? (hex.nativeElement.style.strokeWidth = '2px')
        : (hex.nativeElement.style.strokeWidth = '1px');
    });
    this.points.map((hex, indice) => {
      hex.nativeElement.setAttribute('cx', this.statTable[indice].position.x);
      hex.nativeElement.setAttribute('cy', this.statTable[indice].position.y);
    });
    this.stat.nativeElement.setAttribute('points', this.position);
  }

  createStats() {
    let table: any[] = [];
    if (this.user.metrics) {
      this.user.metrics.map((stat, i) => {
        console.log(stat.value);
        const ratio = stat.value != 0 ? stat.value / this.max : 0;
        const position = {
          x: 130 - this.doneesIniitial[i].vecteur.x * ratio,
          y: 130 - this.doneesIniitial[i].vecteur.y * ratio,
        };
        console.log(this.max, ratio, stat.value);
        this.statTable.push({
          name: stat.name,
          ratio: ratio * 100,
          position: position,
        });
      });
    } else {
      const table: any[] = [
        {
          name: 'corps haut',
          value: 0,
          ratio: 0,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'corps bas',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'souplesse',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'explosivité',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'cardio',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'gainage',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
      ];
      this.statTable = table;
    }
    let position;
    return (position = `${this.statTable[0].position.x},${this.statTable[0].position.y} ${this.statTable[1].position.x},${this.statTable[1].position.y} ${this.statTable[2].position.x},${this.statTable[2].position.y} ${this.statTable[3].position.x},${this.statTable[3].position.y} ${this.statTable[4].position.x},${this.statTable[4].position.y} ${this.statTable[5].position.x},${this.statTable[5].position.y}`);
  }

  createGraph() {
    this.ratio.map((ratio) => {
      const format = this.doneesIniitial.map((vecteur) => {
        const ratioVecteur = {
          x: vecteur.vecteur.x * ratio,
          y: ratio * vecteur.vecteur.y,
        };
        const svgPos = {
          x: 130 - ratioVecteur.x,
          y: 130 - ratioVecteur.y,
        };
        return svgPos;
      });
      this.donneeFormat.push(format);
    });
  }
}
