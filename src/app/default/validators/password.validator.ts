import {FormGroup}  from '@angular/forms';

export function passwordValidator(control: FormGroup): {[key: string]: boolean} {
  // Make agnostic name
  const pass = control.get('pass');
  const confirm = control.get('confirmPass');
  if (!pass || !confirm) return null;
  return pass.value === confirm.value ? null : { nomatch: true };
};
