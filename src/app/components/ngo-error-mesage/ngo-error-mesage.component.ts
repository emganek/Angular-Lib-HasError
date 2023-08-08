import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ErrorTypes =
  | 'required'
  | 'email'
  | 'minlength'
  | 'maxlength'
  | 'min'
  | 'max';
export const ERROR_LIST: { [key in ErrorTypes]: (...param: any) => string } = {
  required: (fieldName: string) =>
    `${fieldName ? fieldName : 'This'} field is required`,
  email: () => 'Email is invalid',
  minlength: (fieldName: string, minLength: number) =>
    `${
      fieldName ? fieldName : 'This'
    } must contain at least ${minLength} characters`,
  maxlength: (fieldName: string, maxlength: number) =>
    `${
      fieldName ? fieldName : 'This'
    } should not exceed ${maxlength} characters`,
  min: (fieldName: string, minNumber: number) =>
    `${fieldName ? fieldName : 'This'} should not smaller than ${minNumber}`,
  max: (fieldName: string, maxNumber: number) =>
    `${fieldName ? fieldName : 'This'} should not bigger than ${maxNumber}`,
};

@Component({
  selector: 'ngo-error-mesage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngo-error-mesage.component.html',
  styleUrls: ['./ngo-error-mesage.component.scss'],
})
export class NgoErrorMesageComponent {
  fieldName: string = '';
  _error: string = '';
  errorMessage = '';
  requiredLength: number;
  minValue: number;
  maxValue: number;

  get error() {
    return this._error;
  }

  set error(value) {
    if (value) {
      switch (value) {
        case 'required':
          this.errorMessage = ERROR_LIST.required(this.fieldName);
          break;
        case 'email':
          this.errorMessage = ERROR_LIST.email();
          break;
        case 'minlength':
          this.errorMessage = ERROR_LIST.minlength(
            this.fieldName,
            this.requiredLength
          );
          break;
        case 'maxlength':
          this.errorMessage = ERROR_LIST.maxlength(
            this.fieldName,
            this.requiredLength
          );
          break;
        case 'min':
          this.errorMessage = ERROR_LIST.min(this.fieldName, this.minValue);
          break;
        case 'max':
          this.errorMessage = ERROR_LIST.max(this.fieldName, this.maxValue);
          break;
        default:
          break;
      }
    } else {
      this.errorMessage = '';
    }
  }

  ngOnInit() {}
}
