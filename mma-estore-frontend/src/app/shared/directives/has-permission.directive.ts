import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);

  private viewContainer = inject(ViewContainerRef);

  private authService = inject(AuthService);

  @Input()
  set appHasPermission(permission: string) {
    this.viewContainer.clear();

    if (this.authService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
