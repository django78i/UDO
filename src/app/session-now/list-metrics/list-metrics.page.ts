import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Health } from '@ionic-native/health/ngx';
import moment from 'moment';

@Component({
  selector: 'app-list-choix',
  templateUrl: './list-metrics.page.html',
  styleUrls: ['./list-metrics.page.scss'],
})
export class ListMetricsPage implements OnInit {
  currentChoix ={name:'Réactions',nombre:'1307',active:false};
  sessionNow: any;
  listChoix = [
  // {name:'Durée',fieldname:'duree', img:'assets/images/timer.svg',secondeImg:'assets/images/timer_w.svg', nombre:'1307',color:'#3CAFEB',active:false,padding:'13px 15px',width:'25px',height:'29px'},
  {name:'Distance',fieldname:'distance',img:'assets/images/distance2.svg' ,secondeImg:'assets/images/distance_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'15px 15px',width:'25px',height:'23px'},
  {name:'Vitesse',fieldname:'',img:'assets/images/speed.svg',secondeImg:'assets/images/speed_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'17px 15px',width:'25px',height:'21px'},
  {name:'Calories',fieldname:'calories',img:'assets/images/calories.svg',secondeImg:'assets/images/calories_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'12px 17px',width:'19px',height:'26px'},
 // {name:'Altitude',fieldname:'',img:'assets/images/moutain.svg',secondeImg:'assets/images/moutain_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'15px 13px',width:'26px',height:'24px'},
  {name:'BPM',fieldname:'heart_rate',img:'assets/images/heart.svg',secondeImg:'assets/images/heart_w.svg',color:'#E6427B', nombre:'500',active:false,padding:'17px 15px',width:'24px',height:'22px'},
  {name:'Nombre de pas',fieldname:'steps',img:'assets/images/step.svg',secondeImg:'assets/images/step_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'18px 13px',width:'28px',height:'17px'},
 // {name:'Allure',fieldname:'',img:'assets/images/allure.svg',secondeImg:'assets/images/allure_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'16px 16px',width:'20px',height:'20px'},
  {name:'Réactions',fieldname:'reaction',img:'assets/images/reaction3.svg',secondeImg:'assets/images/reaction_w.svg',color:'#3CAFEB', nombre:'1307',active:false,padding:'16px 18px',width:'19px',height:'19px'}];
  constructor(private modalCtr: ModalController,
    private navParams: NavParams,
    private health: Health,) { }

  ngOnInit() {
     this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    const value = this.navParams.data.choix;
    for(let val of this.listChoix){
      if(val.name === value.name){
       val.active=true;
       this.currentChoix = val;
      }else{

      }
    }
   }
  queryMetrics(metric, item) {
    if (metric === 'steps' || metric === 'distance') {
      this.health.queryAggregated({
        startDate: new Date(this.sessionNow.startDate), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        bucket: 'hour',
        //limit: 1000
      }).then(res => {
        item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
        console.log('res', res);
      })
        .catch(e => console.log('error3 ', e));
    }
    else {
      this.health.query({
        startDate: new Date(this.sessionNow.startDate), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        limit: 100
      }).then(res => {
        item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
        console.log('res', res);
      })
        .catch(e => console.log('error1 ', e));
    }

    this.health.query({
      startDate: new Date(new Date(this.sessionNow.startDate).getTime()-10*60*60*1000) ,
      endDate: new Date(), // now
      dataType: 'activity',
      limit: 100
    }).then(res => {
   //   item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
      console.log('resActivity', res);
    })
      .catch(e => console.log('error1 ', e));
  }
   getChoix(item){
     this.currentChoix.active=false;
     item.active=true;
     this.currentChoix = item;
     let sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
     if(item.fieldname == 'reaction'){
       if(sessionNow){
         item.nombre = sessionNow.reactions.length;
       }else{
        this.queryMetrics(item.fieldname,item);
       }
     }
     if(item.fieldname =='duree'){
      let currentSeconds,currentMinutes,currentHeures;
      currentSeconds = moment().diff(sessionNow.startDate, 'seconds');
      currentMinutes = moment().diff(sessionNow.startDate, 'minutes');
      currentHeures = moment().diff(sessionNow.startDate, 'hours');

      if(currentSeconds>60){
        if(currentMinutes>60){
          item.nombre =currentHeures+':'+currentMinutes ;
        }else{
          item.nombre= currentMinutes+':'+currentSeconds ;
        }
      }else{
        item.nombre= currentSeconds ;
      }
     }
     else{
       this.queryMetrics(item.fieldname,item);
     }
     // this.close(this.currentChoix);
   }
  async close(data?) {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(data);
  }
}
