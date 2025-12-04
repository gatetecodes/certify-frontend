import { Routes } from "@angular/router";
import { TemplatesPageComponent } from "./templates/templates.page";
import { LoginPageComponent } from "./auth/login.page";
import { authGuard } from "./auth/auth.guard";
import { systemAdminGuard } from "./auth/system-admin.guard";
import { CertificatesPageComponent } from "./certificates/certificates.page";
import { VerifyPageComponent } from "./verify/verify.page";
import { TenantsPageComponent } from "./admin/tenants.page";
import { HomeRedirectComponent } from "./home-redirect.component";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => Promise.resolve(LoginPageComponent),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () => Promise.resolve(HomeRedirectComponent),
  },
  {
    path: "tenants",
    canActivate: [authGuard, systemAdminGuard],
    loadComponent: () => Promise.resolve(TenantsPageComponent),
  },
  {
    path: "templates",
    canActivate: [authGuard],
    loadComponent: () => Promise.resolve(TemplatesPageComponent),
  },
  {
    path: "certificates",
    canActivate: [authGuard],
    loadComponent: () => Promise.resolve(CertificatesPageComponent),
  },
  {
    path: "verify/:publicId",
    loadComponent: () => Promise.resolve(VerifyPageComponent),
  },
];
