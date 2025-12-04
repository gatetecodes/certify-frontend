import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-home-redirect",
  standalone: true,
  template: "",
})
export class HomeRedirectComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const state = this.auth.current;
    if (!state) {
      this.router.navigateByUrl("/login");
      return;
    }

    const destination =
      state.role === "SYSTEM_ADMIN" ? "/tenants" : "/templates";
    this.router.navigateByUrl(destination);
  }
}
