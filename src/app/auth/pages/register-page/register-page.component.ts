import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../services/validators.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styles: ``,
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validatorsService.emailPattern),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: [
        this.validatorsService.areFieldsEqual('password', 'password2'),
      ],
    }
  );

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  register() {
    const { email, password, name } = this.myForm.value;
    this.authService.register(email, password, name).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (message) => Swal.fire('Error', message, 'error'),
    });
  }
}
