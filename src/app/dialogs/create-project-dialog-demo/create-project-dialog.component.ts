import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectPartial } from 'src/app/reducers/projects.actions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-create-project-dialog',
    templateUrl: './create-project-dialog.component.html',
    styleUrls: ['./create-project-dialog.component.css']
})
export class CreateProjectDialogComponent implements OnInit {
    private generalInformation: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.setGeneralInformation();
        this.getProjectInformation();
    }
    public getProjectInformation(): ProjectPartial {
        return {
            name: this.generalInformation.controls.projectName.value,
            description: this.generalInformation.controls.description.value,
            projectOwnerName: this.generalInformation.controls.ownerUsername.value,
        };
    }

    private setGeneralInformation(): void {
        this.generalInformation = this.formBuilder.group({
            // TODO Check that project name is not used yet
            projectName: ['', Validators.required],
            description: [''],
            ownerUsername: [localStorage.getItem('username') ?? '', Validators.required],
        });
    }

    public getGeneralInformation(): FormGroup {
        return this.generalInformation;
    }

}
