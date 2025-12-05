import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TenantsService } from "./tenants.service";

function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
  return valid ? null : { weakPassword: true };
}
@Component({
  selector: "app-tenants-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./tenants.page.html",
  styleUrls: ["./tenants.page.scss"],
})
export class TenantsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tenantsService = inject(TenantsService);

  readonly tenants$ = this.tenantsService.tenants$;

  loading = false;
  submitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  form = this.fb.nonNullable.group({
    tenantName: ["", Validators.required],
    tenantSlug: [""],
    adminFullName: ["", Validators.required],
    adminEmail: ["", [Validators.required, Validators.email]],
    adminPassword: [
      "",
      [Validators.required, Validators.minLength(8), strongPasswordValidator],
    ],
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.errorMessage = null;
    this.tenantsService.loadTenants().subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          "Failed to load customers. Please try again or check your permissions.";
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.tenantsService.createTenant(this.form.getRawValue()).subscribe({
      next: (created) => {
        this.submitting = false;
        this.successMessage = `Organization "${created.name}" created successfully.`;
        this.form.reset({
          tenantName: "",
          tenantSlug: "",
          adminFullName: "",
          adminEmail: "",
          adminPassword: "",
        });
      },
      error: (err) => {
        this.submitting = false;
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 403) {
          this.errorMessage =
            "You do not have permission to create organizations. Please login as a system admin.";
        } else if (err.status === 400) {
          this.errorMessage =
            "Invalid organization details. Please review the form and try again.";
        } else {
          this.errorMessage =
            "Unable to create organization at the moment. Please try again later.";
        }
      },
    });
  }
}
