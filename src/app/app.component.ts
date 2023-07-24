import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormControlWrapperDirective } from './directives/form-control-wrapper.directive';
import { HasErrorDirective } from './directives/has-error.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterOutlet, ButtonModule, InputTextModule, FormControlWrapperDirective, HasErrorDirective],
  providers:[FormControl],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  subscription!: Subscription;
  form = this.fb.group({
    name: ['',[Validators.required]],
    email: ['', [Validators.required]]
  })

  @ViewChild('ngFormRef', {static:true}) ngFormRef: NgForm;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.subscription = this.form.valueChanges.subscribe(console.log);
    console.log(this.ngFormRef)
    console.log('this.form', this.form)
  }

  submit() {
    console.log('this.form', this.form.value);
    console.log(this.form.get('name').hasError('required'))
  }

  checkRequired(fieldName: string) {
    return this.form.get(`${fieldName}`).touched && this.form.get(`${fieldName}`).hasError('required') || this.ngFormRef.submitted && this.form.get(`${fieldName}`).hasError('required');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
