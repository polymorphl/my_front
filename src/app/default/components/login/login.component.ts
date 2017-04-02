import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'my-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @Output() isLogged = new EventEmitter();

  loginForm: FormGroup;

  constructor(fb: FormBuilder,
              private auth: AuthService,
              private _toast: ToastService) {

    this.loginForm = fb.group({
      'email': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  isAuth(): boolean {
    return this.auth.isLoggedIn();
  }

  submitForm(formData: any, valid: boolean) {
    if (valid) {
      let user = {
        email: formData.email,
        password: formData.password
      };

      this.auth.login(user).subscribe(
        (result) => { this.isLogged.emit(true); },
        (err) => {
          this._toast.popError(err.msgs);
        }
      ); // end subscribe
    } // end valid
  }
}
