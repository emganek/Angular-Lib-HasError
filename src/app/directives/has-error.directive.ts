import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { EMPTY, ReplaySubject, Subscription, combineLatest, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { FormControlWrapperDirective } from './form-control-wrapper.directive';

export interface HasErrorContext {
  $implicit: any;
}

@Directive({
  selector: '[hasError]',
  standalone: true
})
export class HasErrorDirective {
  static ngTemplateContextGuard(_dir: HasErrorDirective, ctx: unknown ): ctx is HasErrorContext {
    return true;
  }

  @Input()
  set hasError(errorName: string) {
    this.errorName$.next(errorName);
  }

  private errorName$ = new ReplaySubject<string>(1);
  private ctrl$ = this.hasErrorRoot.formControl$;
  private status$ = this.ctrl$.pipe(
    switchMap((ctrl) => (ctrl?.statusChanges || EMPTY).pipe(startWith(null)))
  );

  private error$ = combineLatest([
    this.ctrl$,
    this.errorName$,
    this.status$,
  ]).pipe(
    map(([ctrl, errorName]) => ({
      hasError: ctrl?.hasError(errorName),
      value: ctrl?.getError(errorName),
    })),
    distinctUntilChanged(
      (x, y) => x.hasError === y.hasError && x.value === y.value
    )
  );

  private view?: EmbeddedViewRef<HasErrorContext>;
  private subscription?: Subscription;

  constructor(
    private hasErrorRoot: FormControlWrapperDirective,
    private templateRef: TemplateRef<HasErrorContext>,
    private vcr: ViewContainerRef
  ) {
    console.log('hasError', hasErrorRoot)
   }

  ngOnInit(): void {
    this.subscription = this.error$.subscribe((error) => {
      if (!error.hasError) {
        this.view?.destroy();
        this.view = undefined;
        return;
      }

      if (this.view) {
        this.view.context.$implicit = error.value;
        this.view.markForCheck();
        return;
      }

      this.view = this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: error.value,
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
