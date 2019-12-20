import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private username: string;
  private password: string;

  constructor(
    // private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(): void {
    // this.apiService.postLogin(this.username, this.password).subscribe((token: Token) => {
    //   if (token) {
    //     localStorage.setItem('token', token.token);
    //     localStorage.setItem('username', this.username);
    this.router.navigate(['dashboard']);
    //   } else {
    //     alert('Invalid credentials');
    //   }
    // });
  }

}
