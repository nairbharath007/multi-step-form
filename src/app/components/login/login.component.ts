import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { USERS } from 'src/app/mock-users';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginFailed: boolean = false;

  constructor(private router: Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin() {
    this.loginFailed = false; 

    const user = USERS.find(u => u.username === this.loginForm.value.username && u.password === this.loginForm.value.password);
    if (user) {
      this.authService.login(user.username);
      this.router.navigate(['/dashboard']);
      this.loginFailed = false;
    } else {
      this.loginFailed = true; 
    }
  }
}


