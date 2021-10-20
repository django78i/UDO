import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compteur',
  templateUrl: './compteur.page.html',
  styleUrls: ['./compteur.page.scss'],
})
export class CompteurPage implements OnInit {

  listImages = ['assets/images/compt9.PNG', 'assets/images/compt8.PNG', 'assets/images/compt7.PNG', 'assets/images/compt6.PNG', 'assets/images/compt5.PNG', 'assets/images/compt4.PNG', 'assets/images/compt3.PNG', 'assets/images/compt2.PNG', 'assets/images/compt1.PNG'];
  currentCompteur = 9;
  current=1;
  max=10;
  list=['Cliquez sur le compte à rebours pour raccourcir le temps','Pensez à vous échauffer au début de votre séance','Les séances libres permettent de partager votre progression avec les autres utilisateurs','Vos données médicales restent privées et ne seront pas partagées ni stockés sur nos serveurs.','Cliquez sur le compte à rebours pour raccourcir le temps','Pensez à vous échauffer au début de votre séance','Les séances libres permettent de partager votre progression avec les autres utilisateurs','Vos données médicales restent privées et ne seront pas partagées ni stockés sur nos serveurs.','Cliquez sur le compte à rebours pour raccourcir le temps'];
  currentElement ='Cliquez sur le compte à rebours pour raccourcir le temps';
  constructor(private router: Router) {
    let i=-1;
    setInterval(()=>{
      this.current +=1 ;
      i++;
      this.currentElement = this.list[i];
      this.currentCompteur --;
      if (this.currentCompteur === 0) {
        this.router.navigate(['session-now/demarrage']);
      }
     }, 1000);
  }

  ngOnInit() {

  }
  goTo(){
    this.router.navigate(['session-now/demarrage']);
  }
}
