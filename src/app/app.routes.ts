import { Routes } from "@angular/router";
import { TemplatesPageComponent } from "./templates/templates.page";
import { LoginPageComponent } from "./auth/login.page";
import { authGuard } from "./auth/auth.guard";
import { CertificatesPageComponent } from "./certificates/certificates.page";
import { VerifyPageComponent } from "./verify/verify.page";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "templates",
  },
  {
    path: "login",
    loadComponent: () => Promise.resolve(LoginPageComponent),
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
