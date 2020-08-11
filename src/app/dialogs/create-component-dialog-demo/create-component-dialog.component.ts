import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ProjectComponentInformation } from 'src/app/types/types-interfaces';
import { ComponentPartial } from 'src/app/reducers/components.actions';

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
            componentName: ['', Validators.required],
            componentDescription: [''],
            ownerUsername: [localStorage.getItem('username') ?? '', Validators.required],
        });
    }

    private setIMSInformation(): void {
        this.imsInformation = this.formBuilder.group({
            imsProviderType: ['1', Validators.required],
        });
    }

    private setRSInformation(): void {
        this.rsInformation = this.formBuilder.group({
            repository: [''],//, Validators.required],
            // TODO Check that account with such name exists
            repositoryOwner: [localStorage.getItem('username') ?? ''],//, Validators.required]
        });
    }

    public getComponentInformation(): {ownerUsername: string, component: ComponentPartial} {
        return {
            ownerUsername: this.generalInformation.controls.ownerUsername.value,
            component: {
                name: this.generalInformation.controls.componentName.value,
                description: this.generalInformation.controls.componentDescription.value,

                imsId: this.imsInformation.controls.imsProviderType.value,
                imsRepository: this.rsInformation.controls.repository.value,
                imsOwner: this.rsInformation.controls.repositoryOwner.value,
            }
        };
    }

    public getGeneralInformation(): FormGroup {
        return this.generalInformation;
    }

    public getIMSInformation(): FormGroup {
        return this.imsInformation;
    }

    public getRSInformation(): FormGroup {
        return this.rsInformation;
    }
}
