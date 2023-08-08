import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[ngoForm]',
  standalone: true,
  host: { '(submit)': 'onSubmit()' },
})
export class NgoFormDirective {
  @Input() formGroup: FormGroup;
  @Output() formSubmit = new EventEmitter();

  isSubmitted = false;

  constructor() {}

  ngOnChanges() {}

  onSubmit() {
    this.isSubmitted = true;
    this.formSubmit.emit();
  }
}
