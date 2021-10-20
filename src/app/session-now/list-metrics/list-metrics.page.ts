import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-list-choix',
  templateUrl: './list-metrics.page.html',
  styleUrls: ['./list-metrics.page.scss'],
})
export class ListMetricsPage implements OnInit {
  currentChoix ={name:'Réactions',nombre:'1307'};
  listChoix = [
  {name:'Durée',img:'assets/images/timer.svg',secondeImg:'assets/images/timer_w.svg', nombre:'1307',color:'#3CAFEB',active:false,padding:'13px 15px',width:'25px',height:'29px'},
  {name:'Distance',img:'assets/images/distance2.svg' ,secondeImg:'assets/images/distance_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'15px 15px',width:'25px',height:'23px'},
  {name:'Vitesse',img:'assets/images/speed.svg',secondeImg:'assets/images/speed_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'17px 15px',width:'25px',height:'21px'},
  {name:'Calories',img:'assets/images/calories.svg',secondeImg:'assets/images/calories_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'12px 17px',width:'19px',height:'26px'},
  {name:'Altitude',img:'assets/images/moutain.svg',secondeImg:'assets/images/moutain_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'15px 13px',width:'26px',height:'24px'},
  {name:'BPM',img:'assets/images/heart.svg',secondeImg:'assets/images/heart_w.svg',color:'#E6427B', nombre:'500',active:false,padding:'17px 15px',width:'24px',height:'22px'},
  {name:'Nombre de pas',img:'assets/images/step.svg',secondeImg:'assets/images/step_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'18px 13px',width:'28px',height:'17px'},
  {name:'Allure',img:'assets/images/allure.svg',secondeImg:'assets/images/allure_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'16px 16px',width:'20px',height:'20px'},
  {name:'Réactions',img:'assets/images/reaction3.svg',secondeImg:'assets/images/reaction_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'16px 18px',width:'19px',height:'19px'}];
  constructor(private modalCtr: ModalController,private navParams: NavParams) { }

  ngOnInit() {
   const value = this.navParams.data.choix;
   console.log('value',value);

   for(const val of this.listChoix){
     if(val.name === value.name){
      val.active=true;
      this.currentChoix = val;
     }
   }
  }

  getChoix(item){
    item.active=true;
    this.currentChoix = item;
    // this.close(this.currentChoix);
  }

  async close(data?) {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(data);
  }
}
