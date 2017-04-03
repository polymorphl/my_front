import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'my-forgot',
  templateUrl: './forgot.component.html'
})
export class ForgotComponent {
  @Output() requestPending = new EventEmitter();

  forgotForm: FormGroup;
  emailSent: boolean;

  constructor(fb: FormBuilder,
              private auth: AuthService,
              private _toast: ToastService) {

    this.forgotForm = fb.group({
      'email': [null, Validators.required]
    });
    this.emailSent = false;
  }

  submitForm(formData: any) {
    this.requestPending.emit(true);
    this.auth.recovery(formData).subscribe(
      (result) => {
        this.emailSent = true;
        this.requestPending.emit(false);
      },
      (err) => {
        this.requestPending.emit(false);
        this._toast.popError(err.msgs);
      },
      () => { this.requestPending.emit(false); }
    )
  }
}
