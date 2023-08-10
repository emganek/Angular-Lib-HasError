import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { NgoFormModule } from 'my-first-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    ButtonModule,
    InputTextModule,
    NgoFormModule
  ],
  providers: [FormControl],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  subscription!: Subscription;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    age: ['', [Validators.required, Validators.min(6), Validators.max(12)]],
  });

  @ViewChild('ngFormRef', { static: true }) ngFormRef: NgForm;

  constructor(private fb: FormBuilder) {}

  submit() {
    this.form.markAllAsTouched();
  }

  checkRequired(fieldName: string) {
    return (
      (this.form.get(`${fieldName}`).touched &&
        this.form.get(`${fieldName}`).hasError('required')) ||
      (this.ngFormRef.submitted &&
        this.form.get(`${fieldName}`).hasError('required'))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
