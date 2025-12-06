import { Component, inject, ChangeDetectorRef } from "@angular/core";
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
  private readonly cdr = inject(ChangeDetectorRef);

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
        this.router.navigateByUrl("/");
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        // Extract error message safely from various possible error formats
        let msg = "Login failed. Check credentials.";
        if (err?.error?.message) {
          msg = err.error.message;
        } else if (typeof err?.error === "string") {
          msg = err.error;
        } else if (err?.status === 401 || err?.status === 403) {
          msg = "Invalid email or password.";
        } else if (err?.status === 0) {
          msg =
            "Unable to connect to the server. Please check your internet connection.";
        }

        this.error = msg;
        console.error("Login error:", err);
        this.cdr.detectChanges();
      },
    });
  }
}
