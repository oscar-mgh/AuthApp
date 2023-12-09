import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../services/validators.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.emailPattern),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  login() {
    const { email, password } = this.myForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (message) => Swal.fire('Error', message, 'error'),
    });
  }
}
