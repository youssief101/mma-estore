import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<any>);

  private viewContainer = inject(ViewContainerRef);

  private authService = inject(AuthService);

  @Input()
  set appHasRole(role: string) {
    this.viewContainer.clear();

    if (this.authService.hasRole(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
