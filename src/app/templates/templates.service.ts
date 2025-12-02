import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, tap } from "rxjs";

export interface PlaceholderDefinition {
  key: string;
  label: string;
  type: string;
  required: boolean;
}

export interface TemplateRequest {
  name: string;
  description: string;
  htmlTemplate: string;
  placeholders: PlaceholderDefinition[];
}

export interface TemplateResponse extends TemplateRequest {
  id: string;
  active: boolean;
  version: number;
}

@Injectable({ providedIn: "root" })
export class TemplatesService {
  private readonly baseUrl = "/api/v1/templates";

  private readonly _templates = new BehaviorSubject<TemplateResponse[]>([]);
  readonly templates$ = this._templates.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadTemplates(): void {
    this.http
      .get<TemplateResponse[]>(this.baseUrl)
      .subscribe((templates) => this._templates.next(templates));
  }

  getTemplate(id: string) {
    return this.http.get<TemplateResponse>(`${this.baseUrl}/${id}`);
  }

  createTemplate(request: TemplateRequest) {
    return this.http
      .post<TemplateResponse>(this.baseUrl, request)
      .pipe(tap(() => this.loadTemplates()));
  }

  updateTemplate(id: string, request: TemplateRequest) {
    return this.http
      .put<TemplateResponse>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.loadTemplates()));
  }
}
