import { NgModule } from '@angular/core';
import { NgoErrorMesageComponent } from './components/ngo-error-mesage/ngo-error-mesage.component';
import { NgoFormControlDirective } from './directives/ngo-form-control.directive';
import { NgoFormDirective } from './directives/ngo-form.directive';

@NgModule({
  declarations: [NgoErrorMesageComponent, NgoFormControlDirective, NgoFormDirective],
  imports: [],
  exports: [NgoErrorMesageComponent, NgoFormControlDirective, NgoFormDirective],
})
export class NgoFormModule {}
