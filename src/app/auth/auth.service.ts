import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../models/admin.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUri:string = 'http://localhost:4300';
  
  isLoggedIn: boolean = false;
  userRole: string = '';
  isLoggedIn$ = new BehaviorSubject(false);
  userRole$ = new BehaviorSubject('');

  constructor(private http: HttpClient) { }
  
  // Authenticate Administrator
  authenticateAdministrator(admin: Admin) {
    return this.http.post(`${this.baseUri}/admins/login`, admin);
  }

   // Authenticate User
   authenticateUser(user: User) {
    return this.http.post(`${this.baseUri}/users/login`, user);
  }
}
