import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssuePartial } from 'src/app/reducers/issue-namespace.actions';
import { IssueType } from 'src/app/reducers/state';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';

@Component({
    selector: 'app-create-issue-dialog',
    templateUrl: './create-issue-dialog.component.html',
    styleUrls: ['./create-issue-dialog.component.css']
})
export class CreateIssueDialogComponent implements OnInit {
    private generalInformation: FormGroup;

    issueType = IssueType;

    constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService) { }

    ngOnInit() {
        this.setGeneralInformation();
    }

    private setGeneralInformation(): void {
        this.generalInformation = this.formBuilder.group({
            title: ['', Validators.required],
            issueType: [IssueType.BUG, Validators.required],
            body: [''],
        });
    }

    public getGeneralInformation(): FormGroup {
        return this.generalInformation;
    }

    public createIssue() {
        const issue: IssuePartial = {
            title: this.generalInformation.controls.title.value,
            type: this.generalInformation.controls.issueType.value,
            textBody: this.generalInformation.controls.body.value,
        };
        this.api.addIssue(this.data.id, issue);
    }

}
