import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-connexion-choice',
  templateUrl: './connexion-choice.component.html',
  styleUrls: ['./connexion-choice.component.scss'],
})
export class ConnexionChoiceComponent implements OnInit {
  formUser: FormGroup;
  hide = true;
  seg = "s'inscrire";

  mdPasse: string = '';
  email: string = '';

  constructor(public userService: UserServiceService, public fb: FormBuilder) {}

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
    console.log('log');
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
}
