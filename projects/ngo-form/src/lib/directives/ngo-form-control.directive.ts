import {
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgoFormDirective } from './ngo-form.directive';
import { NgoErrorMesageComponent } from '../components/ngo-error-mesage/ngo-error-mesage.component';
import { Observable, Subject, Subscription, merge } from 'rxjs';

@Directive({
  selector: '[ngoFormControl]',
  host: { '(blur)': 'onBlur()', '[class.ngo-has-error]': 'error' },
})
export class NgoFormControlDirective implements OnInit, OnDestroy {
  @Input() formControl!: FormControl;
  @Input() label = '';

  error = '';
  requireLength!: number;
  minValue!: number;
  maxValue!: number;
  componentRef: ComponentRef<NgoErrorMesageComponent>;
  subscription: Subscription;
  formSubmit$: Observable<any>;
  valueControlChange$: Observable<any>;
  blur$ = new Subject();

  constructor(
    @SkipSelf() private form: NgoFormDirective,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    if (!this.formControl) return;
    this.formSubmit$ = this.form.formSubmit;
    this.valueControlChange$ = this.formControl.valueChanges;
    this.subscription = merge(
      this.formSubmit$,
      this.blur$,
      this.valueControlChange$
    ).subscribe(() => {
      if (
        this.formControl.errors &&
        (this.formControl.touched || this.formControl.dirty)
      ) {
        this.getError();
      } else {
        this.clearErrorMessage();
      }
    });
  }

  getError() {
    if (this.formControl.hasError('required')) {
      this.error = 'required';
      this.addErrorMessage();
    } else if (this.formControl.hasError('email')) {
      this.error = 'email';
      this.addErrorMessage();
    } else if (this.formControl.hasError('minlength')) {
      this.error = 'minlength';
      this.requireLength = this.formControl.errors['minlength'].requiredLength;
      this.addErrorMessage();
    } else if (this.formControl.hasError('maxlength')) {
      this.error = 'maxlength';
      this.requireLength = this.formControl.errors['maxlength'].requiredLength;
      this.addErrorMessage();
    } else if (this.formControl.hasError('min')) {
      this.error = 'min';
      this.minValue = this.formControl.errors['min'].min;
      this.addErrorMessage();
    } else if (this.formControl.hasError('max')) {
      this.error = 'max';
      this.maxValue = this.formControl.errors['max'].max;
      this.addErrorMessage();
    }
  }

  addErrorMessage() {
    if (!this.componentRef)
      this.componentRef = this.viewContainerRef.createComponent(
        NgoErrorMesageComponent
      );
    this.componentRef.instance.fieldName = this.label;
    this.componentRef.instance.requiredLength = this.requireLength;
    this.componentRef.instance.minValue = this.minValue;
    this.componentRef.instance.maxValue = this.maxValue;
    this.componentRef.instance.error = this.error;
  }

  clearErrorMessage() {
    this.viewContainerRef.clear();
    this.componentRef = null;
  }

  onBlur() {
    this.blur$.next('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
