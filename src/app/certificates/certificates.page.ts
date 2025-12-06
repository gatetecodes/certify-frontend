import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  TemplatesService,
  TemplateResponse,
  PlaceholderDefinition,
} from "../templates/templates.service";
import {
  CertificatesService,
  CertificateResponse,
} from "./certificates.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-certificates-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./certificates.page.html",
  styleUrls: ["./certificates.page.scss"],
})
export class CertificatesPageComponent implements OnInit, OnDestroy {
  private readonly templatesService = inject(TemplatesService);
  private readonly certificatesService = inject(CertificatesService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);

  private subscriptions: Subscription[] = [];

  templates: TemplateResponse[] = [];
  certificates: CertificateResponse[] = [];

  selectedTemplateId: string | null = null;
  formData: Record<string, unknown> = {};
  loading = false;
  error: string | null = null;
  openActionsId: string | null = null;

  ngOnInit(): void {
    this.templatesService.loadTemplates();
    const templatesSub = this.templatesService.templates$.subscribe((t) => {
      console.log("Templates updated:", t);
      this.templates = t;
    });
    this.subscriptions.push(templatesSub);
    this.refreshCertificates();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onTemplateChange(templateId: string): void {
    this.selectedTemplateId = templateId;
    const template = this.templates.find((t) => t.id === templateId);
    this.formData = {};
    template?.placeholders.forEach((p) => {
      this.formData[p.key] = "";
    });
  }

  simulate(): void {
    if (!this.selectedTemplateId) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.certificatesService
      .simulate({
        templateId: this.selectedTemplateId,
        data: this.formData,
      })
      .subscribe({
        next: (blob) => {
          this.loading = false;
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
        },
        error: () => {
          this.loading = false;
          this.error = "Failed to simulate certificate.";
        },
      });
  }

  generate(): void {
    if (!this.selectedTemplateId) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.certificatesService
      .generate({
        templateId: this.selectedTemplateId,
        data: this.formData,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.refreshCertificates();
        },
        error: () => {
          this.loading = false;
          this.error = "Failed to generate certificate.";
        },
      });
  }

  download(certificate: CertificateResponse): void {
    this.openActionsId = null;
    this.certificatesService.download(certificate.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate-${certificate.id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  revoke(certificate: CertificateResponse): void {
    if (
      certificate.status !== "GENERATED" ||
      !confirm(
        "Are you sure you want to revoke this certificate? This action cannot be undone."
      )
    ) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.certificatesService.revoke(certificate.id).subscribe({
      next: () => {
        this.loading = false;
        this.refreshCertificates();
      },
      error: () => {
        this.loading = false;
        this.error = "Failed to revoke certificate.";
      },
    });
  }

  openVerification(certificate: CertificateResponse): void {
    this.openActionsId = null;
    if (certificate.verificationUrl && certificate.status === "GENERATED") {
      window.open(certificate.verificationUrl, "_blank");
    }
  }

  templateName(templateId: string): string {
    const tpl = this.templates.find((t) => t.id === templateId);
    if (tpl) {
      return tpl.name;
    }
    return `${templateId.slice(0, 8)}…`;
  }

  toggleActions(certificate: CertificateResponse): void {
    this.openActionsId =
      this.openActionsId === certificate.id ? null : certificate.id;
  }

  private refreshCertificates(): void {
    // Clear existing certificates before loading new ones
    this.certificates = [];
    this.loading = true;

    const certsSub = this.certificatesService.list().subscribe({
      next: (list) => {
        console.log("Certificates received:", list);
        this.certificates = list || [];
        console.log("Certificates assigned:", this.certificates);
        this.loading = false;
        // Force change detection to ensure UI updates immediately
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Failed to load certificates:", error);
        this.certificates = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
    this.subscriptions.push(certsSub);
  }

  get currentPlaceholders(): PlaceholderDefinition[] {
    if (!this.selectedTemplateId) {
      return [];
    }
    const template = this.templates.find(
      (tpl) => tpl.id === this.selectedTemplateId
    );
    return template?.placeholders ?? [];
  }
}
