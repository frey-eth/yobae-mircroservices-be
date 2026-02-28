import { Observable } from 'rxjs';

export interface UserMessage {
  id: string;
  email: string;
  name: string;
  gender: string;
  pricePerHour?: number; // for users who can be booked (hangout)
}

export interface UsersGrpcService {
  createUser(data: {
    name: string;
    email: string;
    password: string;
    gender: string;
  }): Observable<{ status: string; user: UserMessage }>;

  updateUser(data: {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    gender?: string;
  }): Observable<{ message: string }>;

  findByEmail(data: { email: string }): Observable<UserMessage>;

  findById(data: { id: string }): Observable<UserMessage>;
}
