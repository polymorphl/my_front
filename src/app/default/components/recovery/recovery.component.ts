import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'my-recovery',
  templateUrl: './recovery.component.html'
})
export class RecoveryComponent {
  @Output() requestPending = new EventEmitter();

  recoveryForm: FormGroup;
  emailSent: boolean;

  constructor(fb: FormBuilder,
              private auth: AuthService,
              private _toast: ToastService) {

    this.recoveryForm = fb.group({
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
