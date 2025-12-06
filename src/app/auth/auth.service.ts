import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, tap } from "rxjs";
import { buildApiUrl } from "../../environments/environment";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  tenantId: string;
  fullName: string;
  email: string;
  role: "SYSTEM_ADMIN" | "TENANT_ADMIN" | "TENANT_USER";
}

export interface AuthState extends LoginResponse {}

const STORAGE_KEY = "certify_auth";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly _state = new BehaviorSubject<AuthState | null>(
    this.loadFromStorage()
  );
  readonly state$ = this._state.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  get current(): AuthState | null {
    return this._state.value;
  }

  get isSystemAdmin(): boolean {
    return this.current?.role === "SYSTEM_ADMIN";
  }

  login(payload: LoginRequest) {
    return this.http
      .post<LoginResponse>(buildApiUrl("/api/auth/login"), payload)
      .pipe(
        tap((res) => {
          this._state.next(res);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
        })
      );
  }

  logout() {
    this._state.next(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigateByUrl("/login");
  }

  private loadFromStorage(): AuthState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthState) : null;
    } catch {
      return null;
    }
  }
}
