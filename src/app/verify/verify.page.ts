import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { buildApiUrl } from "../../environments/environment";
import { timeout } from "rxjs";

interface VerifyResponse {
  valid: boolean;
  reason: string;
  certificateId: string;
  templateId: string;
  issuedAt: string;
}

@Component({
  selector: "app-verify-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./verify.page.html",
  styleUrls: ["./verify.page.scss"],
})
export class VerifyPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  error: string | null = null;
  result: VerifyResponse | null = null;

  ngOnInit(): void {
    const publicId = this.route.snapshot.paramMap.get("publicId");
    console.log("Verifying certificate with publicId:", publicId);

    if (!publicId) {
      this.error = "Missing verification id.";
      this.loading = false;
      return;
    }

    const url = buildApiUrl(`/public/verify/${publicId}`);
    console.log("Verification URL:", url);

    this.http
      .get<VerifyResponse>(url)
      .pipe(
        timeout(10000) // 10 second timeout
      )
      .subscribe({
        next: (res) => {
          console.log("Verification response:", res);
          this.result = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.handleError(err);
        },
      });
  }

  private handleError(err: any): void {
    console.error("Verification failed", err);
    console.error("Error details:", {
      status: err?.status,
      statusText: err?.statusText,
      message: err?.message,
      error: err?.error,
      name: err?.name,
    });

    // Always set loading to false to prevent stuck state
    this.loading = false;
    this.cdr.detectChanges();

    if (!err) {
      this.error = "An unknown error occurred while verifying the certificate.";
      this.cdr.detectChanges();
      return;
    }

    if (err.name === "TimeoutError") {
      this.error = "The verification request timed out. Please try again.";
      return;
    }

    const status = err?.status;

    if (status === 0 || !status) {
      // Network error or CORS issue
      this.error =
        "Unable to connect to the server. Please check your connection and ensure the backend is running.";
    } else if (status === 404) {
      this.error = "This verification link is not valid (token not found).";
    } else if (status === 400) {
      this.error = "The verification link is malformed.";
    } else if (status === 500) {
      this.error = "Server error occurred while verifying the certificate.";
    } else {
      const errorMessage =
        err?.error?.message || err?.message || "Unknown error";
      this.error = `Could not verify this certificate. ${errorMessage}`;
    }
    this.cdr.detectChanges();
  }
}
