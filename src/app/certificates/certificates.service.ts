import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CertificateGenerateRequest {
  templateId: string;
  data: Record<string, unknown>;
}

export interface CertificateResponse {
  id: string;
  templateId: string;
  tenantId: string;
  status: string;
  storagePath: string;
  hash: string;
  createdBy: string;
  createdAt: string;
  data: Record<string, unknown>;
  verificationPublicId: string | null;
  verificationUrl: string | null;
}

export type CertificateJobStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface CertificateJobResponse {
  id: string;
  templateId: string;
  status: CertificateJobStatus;
  certificateId: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: "root" })
export class CertificatesService {
  private readonly baseUrl = "/api/v1/certificates";

  constructor(private readonly http: HttpClient) {}

  list(): Observable<CertificateResponse[]> {
    return this.http.get<CertificateResponse[]>(this.baseUrl);
  }

  generate(
    request: CertificateGenerateRequest
  ): Observable<CertificateResponse> {
    return this.http.post<CertificateResponse>(this.baseUrl, request);
  }

  revoke(id: string): Observable<CertificateResponse> {
    return this.http.post<CertificateResponse>(
      `${this.baseUrl}/${id}/revoke`,
      {}
    );
  }

  simulate(request: CertificateGenerateRequest): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/simulate`, request, {
      responseType: "blob",
    });
  }

  download(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, {
      responseType: "blob",
    });
  }

  submitJob(
    request: CertificateGenerateRequest
  ): Observable<CertificateJobResponse> {
    return this.http.post<CertificateJobResponse>(
      `${this.baseUrl}/async`,
      request
    );
  }

  getJobStatus(id: string): Observable<CertificateJobResponse> {
    return this.http.get<CertificateJobResponse>(`${this.baseUrl}/jobs/${id}`);
  }
}
