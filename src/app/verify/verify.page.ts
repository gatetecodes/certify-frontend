import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

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
export class VerifyPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  loading = true;
  error: string | null = null;
  result: VerifyResponse | null = null;

  ngOnInit(): void {
    const publicId = this.route.snapshot.paramMap.get("publicId");
    if (!publicId) {
      this.error = "Missing verification id.";
      this.loading = false;
      return;
    }

    this.http.get<VerifyResponse>(`/public/verify/${publicId}`).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("Verification failed", err);
        if (err.status === 404) {
          this.error = "This verification link is not valid (token not found).";
        } else if (err.status === 400) {
          this.error = "The verification link is malformed.";
        } else {
          this.error =
            "Could not verify this certificate. Please try again later.";
        }
        this.loading = false;
      },
    });
  }
}
