import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SessionNowService } from '../../services/session-now-service.service';

@Component({
  selector: 'app-activites',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  listActivites: any = [];
  value: any;
  mode = "";
  modeClasse = "";
  activities:any;
  constructor(private modalCtr: ModalController,private sessionService:SessionNowService) { 
    setInterval(() => {
      if (localStorage.getItem('mode')) {
        if (localStorage.getItem('mode') == 'landscape') {
          this.mode = 'landscape';
          this.modeClasse = "rondLands";
        } else {
          this.mode = 'portrait';
          this.modeClasse = "rond";
        }
      } else {
        this.modeClasse = "aideSlide";
      }
    }, 100);
    this.sessionService.getActivities().subscribe(resp=>{
      console.log("resp",resp);
      this.activities = resp;
      let i=0;
      for(let activite of this.activities){
        let value ={
          name:activite.nom,
          nombres:activite.sousAcitivite.length,
        }
        let children=[];
        for(let souscActivite of activite.sousAcitivite){
          let details =[
            {name:'Corps haut',value:souscActivite.metriques['muscle haut du corps'],image:'assets/images/corps-haut.svg'},{name:'Corps bas',value:souscActivite.metriques['muscle bas du corps'],image:'assets/images/corps-bas.svg'},{name:'Cardio',value:souscActivite.metriques['cardio'],image:'assets/images/cardio.svg'},{name:'Explosivité',value:souscActivite.metriques['explosivité'],image:'assets/images/explosivite.svg'},{name:'Souplesse',value:souscActivite.metriques['souplesse'],image:'assets/images/souplesse.svg'},{name:'Gainage',value:souscActivite.metriques['muscle abdo/gainage'],image:'assets/images/gainage.svg'}
          ]
          children.push({
            image: souscActivite.icon, checked: false, name: souscActivite.nom, width: '27px', height: '24px', padding: '11px 10px',width2:'37px', padding2: '34px 34px' ,details:details
          })
        } 

        value['children'] = children;
        value['id']=i;
        this.listActivites.push(value);
        i++;
      }
      
    })
  }

  ngOnInit() {
    const current = JSON.parse(localStorage.getItem('activite'));
  
    if (current) {
      for (const item of this.listActivites) {
        for (const activite of item.children) {
          if (activite.name == current.name) {
            activite.checked = true;
          }
        }
      }
    }
  }

  iconWork(id: string) {
    const icon1 = document.getElementById(id);
    icon1.style.display = 'none';

    const icon2 = document.getElementById(id + 'icon2');
    icon2.style.display = 'block';
    this.value = id + 'icon2';

  }

  revIconWork(id: string) {
    const icon1 = document.getElementById(id);
    icon1.style.display = 'block';

    const icon2 = document.getElementById(id + 'icon2');
    icon2.style.display = 'none';
    this.value = id;

  }

  async close() {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  checkActivite(item) {
    item.checked =true;
    localStorage.setItem('activite', JSON.stringify(item));
    this.modalCtr.dismiss();
  }
}
