import { Component, OnInit, inject } from "@angular/core";
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

@Component({
  selector: "app-certificates-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./certificates.page.html",
  styleUrls: ["./certificates.page.scss"],
})
export class CertificatesPageComponent implements OnInit {
  private readonly templatesService = inject(TemplatesService);
  private readonly certificatesService = inject(CertificatesService);

  templates: TemplateResponse[] = [];
  certificates: CertificateResponse[] = [];

  selectedTemplateId: string | null = null;
  formData: Record<string, unknown> = {};
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.templatesService.loadTemplates();
    this.templatesService.templates$.subscribe((t) => (this.templates = t));
    this.refreshCertificates();
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

  private refreshCertificates(): void {
    this.certificatesService
      .list()
      .subscribe((list) => (this.certificates = list));
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
