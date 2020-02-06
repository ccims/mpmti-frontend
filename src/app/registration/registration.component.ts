import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
    private registerData: FormGroup;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.registerData = this.formBuilder.group({
            username: ['',
                [
                    Validators.required,
                    // TODO Check that username is still unused
                    Validators.minLength(4),
                    Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
                ]
            ],
            email: ['',
                [
                    Validators.required,
                    // TODO Check that there is no account with such e-mail
                    Validators.email
                ]
            ],
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/)
                ]
            ],
            repeatedPassword: ['',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/),
                    matchOtherValidator('password')
                ]
            ]
        });
    }

    protected register(): void {
        const username: string = this.registerData.controls.username.value;
        const email: string = this.registerData.controls.email.value;
        const password: string = this.registerData.controls.password.value;
        console.log(`Username: ${username}, E-Mail: ${email}, Password: ${password}`);

        // TODO implement
        this.router.navigate(['login']);
    }

    protected getRegisterData(): FormGroup {
        return this.registerData;
    }
}

export function matchOtherValidator(otherControlName: string) {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {

        if (!control.parent) {
            return null;
        }

        // Initializing the validator.
        if (!thisControl) {
            thisControl = control;
            otherControl = control.parent.get(otherControlName) as FormControl;
            if (!otherControl) {
                throw new Error('matchOtherValidator(): other control is not found in parent group');
            }
            otherControl.valueChanges.subscribe(() => {
                thisControl.updateValueAndValidity();
            });
        }

        if (!otherControl) {
            return null;
        }

        if (otherControl.value !== thisControl.value) {
            return {
                matchOther: true
            };
        }

        return null;
    };
}
