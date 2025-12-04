import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const systemAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.current?.role === "SYSTEM_ADMIN") {
    return true;
  }

  router.navigateByUrl("/templates");
  return false;
};
