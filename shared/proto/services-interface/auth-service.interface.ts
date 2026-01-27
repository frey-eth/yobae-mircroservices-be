import { Observable } from 'rxjs';

export interface AuthGrpcService {
  login(data: {
    email: string;
    password: string;
  }): Observable<{ accessToken: string; refreshToken: string }>;

  refreshToken(data: {
    refreshToken: string;
  }): Observable<{ accessToken: string; refreshToken: string }>;
}
