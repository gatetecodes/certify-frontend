import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";

export interface TenantAdminContact {
  fullName: string;
  email: string;
}

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  admin: TenantAdminContact | null;
}

export interface CreateTenantRequest {
  tenantName: string;
  tenantSlug?: string | null;
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
}

@Injectable({ providedIn: "root" })
export class TenantsService {
  private readonly tenantsSubject = new BehaviorSubject<TenantSummary[]>([]);

  readonly tenants$ = this.tenantsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadTenants(): Observable<TenantSummary[]> {
    return this.http
      .get<TenantSummary[]>(`${environment.apiUrl}/api/admin/tenants`)
      .pipe(tap((tenants) => this.tenantsSubject.next(tenants)));
  }

  createTenant(payload: CreateTenantRequest): Observable<TenantSummary> {
    return this.http
      .post<TenantSummary>(`${environment.apiUrl}/api/admin/tenants`, payload)
      .pipe(
        tap((created) => {
          const current = this.tenantsSubject.value;
          this.tenantsSubject.next([created, ...current]);
        })
      );
  }
}
