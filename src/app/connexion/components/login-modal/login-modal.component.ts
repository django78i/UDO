import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { ModalController } from '@ionic/angular';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  formUser: FormGroup;
  hide = true;
  seg = "s'inscrire";

  icons = [
    {
      type: 'femme',
      icon: '../../assets/icon/Icon ionic-md-female.svg',
    },
    {
      type: 'homme',
      icon: '../../assets/icon/Icon ionic-md-male.svg',
    },
  ];

  @ViewChild('inputPassword') passwordInput: MatInput;
  constructor(
    public userService: UserServiceService,
    public modalCtl: ModalController,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formUser = this.fb.group({
      mail: [''],
      password: [''],
    });
  }

  login() {
    this.userService.connectGoogle();
  }

  get password() {
    return this.formUser.get('password');
  }
  get mail() {
    return this.formUser.get('mail');
  }

  logout() {
    this.userService.logout();
  }

  segmentChanged(event) {
    console.log(event);
  }

  close() {
    this.modalCtl.dismiss();
  }
}
