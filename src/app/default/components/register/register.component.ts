import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';

import { ShowHideDirective } from "../../directives/showHide.directive";

import { emailValidator } from '../../validators/email.validator';
import { passwordValidator } from '../../validators/password.validator';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'my-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  @Output() isRegistred = new EventEmitter();

  registerForm: FormGroup;
  nk: AbstractControl;
  email: AbstractControl;
  gamekey: AbstractControl;
  cgu: AbstractControl;

  // Manage Show-Hide
  showPass = false;
  @ViewChild(ShowHideDirective) input: ShowHideDirective;

  constructor(private _fb: FormBuilder, private _toast: ToastService,
              private auth: AuthService) {
    const NAME_LENGTH_MIN = 6;
    const NAME_LENGTH_MAX = 15;
    const PASS_LENGTH_MIN = 8;
    const PASS_LENGTH_MAX = 32;

    this.registerForm = this._fb.group({
      email: [null, Validators.compose([
        Validators.required, emailValidator
      ])],
      password: this._fb.group({
        pass: [null, Validators.compose([
          Validators.required,
          Validators.minLength(PASS_LENGTH_MIN),
          Validators.maxLength(PASS_LENGTH_MAX)])],
        confirmPass: [null, Validators.compose([
          Validators.required,
          Validators.minLength(PASS_LENGTH_MIN),
          Validators.maxLength(PASS_LENGTH_MAX)])]
      }, { validator: passwordValidator }),
      cgu: [false, Validators.requiredTrue]
    });

    // Alias => inputs
    this.email = this.registerForm.controls['email'];
    this.cgu = this.registerForm.controls['cgu'];
  }

  togglePasswordVisibility() {
    this.showPass = !this.showPass;
    if (this.showPass) { this.input.changeType("text"); }
    else { this.input.changeType("password"); }
  };

  submitForm(formData) {
    this.isRegistred.emit({p: true, r: false});
    let user = {
      nickname: formData.nickname,
      email: formData.email,
      gamekey: formData.gamekey,
      password: formData.password.pass,
      confirmPassword: formData.password.confirmPass
    };

    this.auth.register(user).subscribe(
      (result) => {
        let user = {
          email: formData.email,
          password: formData.password.pass
        }
        this.auth.login(user).subscribe(
          (result) => {
            this.isRegistred.emit({p: false, r: true});
            this._toast.popSuccess([{ msg: 'auth.success.register.0'}]);
          },
          (err) => {
            this.isRegistred.emit({p: false, r: true});
            this._toast.popError(err.msgs);
          }
        );
      },
      (err) => {
        this.isRegistred.emit({p: false, r: false});
        this._toast.popError(err.msgs);
      }
    );
  }
}
