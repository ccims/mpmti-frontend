import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ProjectComponentInformation } from 'src/app/types/types-interfaces';

@Component({
    selector: 'app-create-component-dialog',
    templateUrl: './create-component-dialog.component.html',
    styleUrls: ['./create-component-dialog.component.css'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
    }]
})
export class CreateComponentDialogComponent implements OnInit {
    private generalInformation: FormGroup;
    private imsInformation: FormGroup;
    private rsInformation: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.setGeneralInformation();
        this.setIMSInformation();
        this.setRSInformation();
        this.getComponentInformation();
    }

    private setGeneralInformation(): void {
        this.generalInformation = this.formBuilder.group({
            // TODO Check that component name is not used in this project
            componentName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^[a-z]+(-[a-z]+)*$/)
                ]
            ],
            // TODO Check that account with such name exists
            componentOwnerName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
                ]
            ]
        });
    }

    private setIMSInformation(): void {
        this.imsInformation = this.formBuilder.group({
            imsURL: ['',
                [
                    Validators.required,
                    Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
                ]
            ],
            imsProviderType: ['', Validators.required],
            // TODO Check that account with such name exists
            imsOwnerName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
                ]
            ]
        });
    }

    private setRSInformation(): void {
        this.rsInformation = this.formBuilder.group({
            rsURL: ['',
                [
                    Validators.required,
                    Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
                ]
            ],
            rsProviderType: ['', Validators.required],
            // TODO Check that account with such name exists
            rsOwnerName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
                ]
            ]
        });
    }

    protected getComponentInformation(): ProjectComponentInformation {
        return {
            generalInformation: {
                componentName: this.generalInformation.controls.componentName.value,
                componentOwnerName: this.generalInformation.controls.componentOwnerName.value
            },
            imsInformation: {
                imsURL: this.imsInformation.controls.imsURL.value,
                imsProviderType: this.imsInformation.controls.imsProviderType.value,
                imsOwnerName: this.imsInformation.controls.imsOwnerName.value
            },
            rsInformation: {
                rsURL: this.rsInformation.controls.rsURL.value,
                rsProviderType: this.rsInformation.controls.rsProviderType.value,
                rsOwnerName: this.rsInformation.controls.rsOwnerName.value
            }
        };
    }

    protected getGeneralInformation(): FormGroup {
        return this.generalInformation;
    }

    protected getIMSInformation(): FormGroup {
        return this.imsInformation;
    }

    protected getRSInformation(): FormGroup {
        return this.rsInformation;
    }
}
