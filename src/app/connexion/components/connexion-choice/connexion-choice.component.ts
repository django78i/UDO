import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user-service.service';
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
  @Output() log: EventEmitter<[]> = new EventEmitter();
  mdPasse: string = '';
  email: string = '';

  constructor(public userService: UserService, public fb: FormBuilder) {}

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
    this.log.emit([]);
  }

  connexion() {
    const formValue = {
      mail: this.email,
      password: this.mdPasse,
    };

    this.seg == "s'inscrire"
      ? this.userService.createUser(formValue)
      : this.userService.log(formValue);
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
