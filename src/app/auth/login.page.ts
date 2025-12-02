import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService, LoginRequest } from "./auth.service";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: LoginRequest = {
    email: "",
    password: "",
  };
  loading = false;
  error: string | null = null;

  submit() {
    if (!this.form.email || !this.form.password) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.auth.login(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl("/templates");
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? "Login failed. Check credentials.";
      },
    });
  }
}
