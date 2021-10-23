import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donnees-prive',
  templateUrl: './donnees-prive.component.html',
  styleUrls: ['./donnees-prive.component.scss'],
})
export class DonneesPriveComponent implements OnInit {

  constructor(private modalCtr:ModalController,private router:Router) { }

  ngOnInit() {}

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
  publier(){
    this.close();
    this.router.navigate(['session-now/felicitation']);
  }
}
