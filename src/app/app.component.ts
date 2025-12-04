import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "./auth/auth.service";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  heroSquares2x2,
  heroShieldCheck,
  heroArrowRightOnRectangle,
} from "@ng-icons/heroicons/outline";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    NgIconComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [
    provideIcons({
      heroSquares2x2,
      heroShieldCheck,
      heroArrowRightOnRectangle,
    }),
  ],
})
export class AppComponent {
  readonly auth = inject(AuthService);

  get isSystemAdmin(): boolean {
    return this.auth.current?.role === "SYSTEM_ADMIN";
  }

  get showsTenantNav(): boolean {
    return !!this.auth.current && this.auth.current.role !== "SYSTEM_ADMIN";
  }
}
