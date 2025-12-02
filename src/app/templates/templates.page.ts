import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TemplatesService, TemplateRequest } from "./templates.service";

@Component({
  selector: "app-templates-page",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./templates.page.html",
  styleUrls: ["./templates.page.scss"],
})
export class TemplatesPageComponent {
  private readonly templatesService = inject(TemplatesService);

  templates$ = this.templatesService.templates$;

  selectedTemplateId: string | null = null;
  form: TemplateRequest = {
    name: "",
    description: "",
    htmlTemplate: "<h1>Certificate for ${recipientName}</h1>",
    placeholders: [
      {
        key: "recipientName",
        label: "Recipient Name",
        type: "text",
        required: true,
      },
      { key: "issueDate", label: "Issue Date", type: "date", required: true },
    ],
  };

  saving = false;
  saveError: string | null = null;
  saveSuccess = false;

  ngOnInit(): void {
    this.templatesService.loadTemplates();
  }

  selectTemplate(id: string, name: string): void {
    this.selectedTemplateId = id;
    this.saveError = null;
    this.saveSuccess = false;
    this.templatesService.getTemplate(id).subscribe((tpl) => {
      this.form = {
        name: tpl.name,
        description: tpl.description ?? "",
        htmlTemplate: tpl.htmlTemplate ?? "",
        placeholders: tpl.placeholders,
      };
    });
  }

  newTemplate(): void {
    this.selectedTemplateId = null;
    this.saveError = null;
    this.saveSuccess = false;
    this.form = {
      name: "",
      description: "",
      htmlTemplate: "<h1>Certificate for ${recipientName}</h1>",
      placeholders: [],
    };
  }

  addPlaceholder(): void {
    this.form.placeholders.push({
      key: "",
      label: "",
      type: "text",
      required: false,
    });
  }

  removePlaceholder(index: number): void {
    this.form.placeholders.splice(index, 1);
  }

  save(): void {
    this.saving = true;
    this.saveError = null;
    this.saveSuccess = false;

    const obs = this.selectedTemplateId
      ? this.templatesService.updateTemplate(this.selectedTemplateId, this.form)
      : this.templatesService.createTemplate(this.form);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
      },
      error: (err) => {
        this.saving = false;
        this.saveSuccess = false;
        if (err.status === 403) {
          this.saveError =
            "You do not have permission to create/edit templates. Please login as a tenant admin.";
        } else if (err.status === 400) {
          this.saveError =
            "Template data is invalid. Please check required fields.";
        } else {
          this.saveError = "Failed to save template. Please try again.";
        }
      },
    });
  }
}
