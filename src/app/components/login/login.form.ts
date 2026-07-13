import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface LoginFormControls {
  username: FormControl<string>;
  password: FormControl<string>;
}

/**
 * Factory that creates a fresh typed reactive form for the login flow.
 * Used by both LoginComponent (full-page) and LoginDialogComponent (session-expired dialog).
 *
 * Note: only `required` is validated client-side for login. Min-length and complexity
 * rules belong on the registration form — enforcing them at login would break accounts
 * created before those rules existed.
 */
export function createLoginForm(): FormGroup<LoginFormControls> {
  return new FormGroup<LoginFormControls>({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}
