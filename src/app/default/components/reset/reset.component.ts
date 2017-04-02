import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';

import { passwordValidator } from '../../validators/password.validator';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import {ShowHideDirective} from "../../directives/showHide.directive";

@Component({
  selector: 'my-reset',
  templateUrl: './reset.component.html'
})
export class ResetComponent {
  @Output() isReset = new EventEmitter();

  resetForm: FormGroup;

  // Manage Show-Hide
  showPass = false;
  @ViewChild(ShowHideDirective) input: ShowHideDirective;

  constructor(fb: FormBuilder,
              private _toast: ToastService,
              private _auth: AuthService,
              private _router: Router) {

    const PASS_LENGTH_MIN = 8;
    const PASS_LENGTH_MAX = 32;
    this.resetForm = fb.group({
      'pass': [null, Validators.compose([
        Validators.required,
        Validators.minLength(PASS_LENGTH_MIN),
        Validators.maxLength(PASS_LENGTH_MAX)
      ])],
      'confirmPass': [null, Validators.compose([
        Validators.required,
        Validators.minLength(PASS_LENGTH_MIN),
        Validators.maxLength(PASS_LENGTH_MAX)
      ])]
    }, { validator: passwordValidator })
  }

  togglePasswordVisibility() {
    this.showPass = !this.showPass;
    if (this.showPass) { this.input.changeType("text"); }
    else { this.input.changeType("password"); }
  };

  submitForm(formData: any) {
    this.isReset.emit(false);
    // Add token to req
    formData.token = this._router.url;
    formData.token = formData.token.substring(formData.token.lastIndexOf("/") + 1);

    this._auth.reset(formData).subscribe(
      (result) => {
        this.isReset.emit(true);
        this._toast.popSuccess([ {msg: 'auth.success.reset.0'} ]);
      },
      (err) => { this.isReset.emit(true); }
    );
  }
}
