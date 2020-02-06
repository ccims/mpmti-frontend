import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
    }]
})
export class LoginComponent implements OnInit {
    private loginData: FormGroup;
    private username: string;
    private password: string;

    constructor(
        // private apiService: ApiService,
        private router: Router,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.loginData = this.formBuilder.group({
            username: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
                ]
            ],
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/)
                ]
            ]
        });
    }

    protected login(): void {
        this.username = this.loginData.controls.username.value;
        this.password = this.loginData.controls.password.value;
        console.log(`Username: ${this.username}, Password: ${this.password}`);
        // this.apiService.postLogin(this.username, this.password).subscribe((token: Token) => {
        //   if (token) {
        //     localStorage.setItem('token', token.token);
        //     localStorage.setItem('username', this.username);
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('username', this.username);
        this.router.navigate(['dashboard']);
        //   } else {
        //     alert('Invalid credentials');
        //   }
        // });
    }

    protected getLoginData(): FormGroup {
        return this.loginData;
    }

}
