import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false
  private username : string | null = null;

  login(username: string) : void {
    this.isAuthenticated = true;
    this.username = username
  }

  logout() :void {
    this.isAuthenticated = false
    this.username = null;
  }

  isLoggedIn() : boolean {
    return this.isAuthenticated
  }

  getUserName() : string | null {
    return this.username
  }

  constructor() { }
}
