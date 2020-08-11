import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssuePartial } from 'src/app/reducers/issue-namespace.actions';
import { IssueType, Issue, State, IssuesState, IssueRelationType, Component as ProjectComponent, IssueRelation } from 'src/app/reducers/state';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';
import { Store, select } from '@ngrx/store';
import { selectIssuesState, selectSingleIssue } from 'src/app/reducers/issues.selector';
import { take } from 'rxjs/operators';
import { selectProjectComponentList } from 'src/app/reducers/components.selector';

@Component({
    selector: 'app-edit-issue-dialog',
    templateUrl: './edit-issue-dialog.component.html',
    styleUrls: ['./edit-issue-dialog.component.css']
})
export class EditIssueDialogComponent implements OnInit {
    private generalInformation: FormGroup;
    private issueRelationInformation: FormGroup;

    components: ProjectComponent[];
    issues: IssuesState;

    relatedIssues: IssueRelation[];

    issueType = IssueType;
    issueRelationType = IssueRelationType;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private store: Store<State>,
        private api: ApiService
    ) { }

    ngOnInit() {
        this.setGeneralInformation();
        this.setIssueRelationInformation();
        this.store.pipe(select(selectIssuesState), take(1)).subscribe(issues => {
            this.issues = issues;
        });
        this.store.pipe(select(selectProjectComponentList, this.data.projectId), take(1)).subscribe(components => {
            this.components = components;
        });
        this.store.pipe(select(selectSingleIssue, this.data.issue.id)).subscribe(issue => {
            if (issue == null) {
                return;
            }

            this.generalInformation.controls.title.setValue(issue.title);
            this.generalInformation.controls.issueType.setValue(issue.type);
            this.generalInformation.controls.body.setValue(issue.textBody);
            this.relatedIssues = issue.relatedIssues;
        });
    }

    private setGeneralInformation(): void {
        const issue: Issue = this.data.issue;
        this.generalInformation = this.formBuilder.group({
            title: [issue?.title ?? '', Validators.required],
            issueType: [issue?.type ?? IssueType.BUG, Validators.required],
            body: [issue?.textBody ?? ''],
        });
    }

    public getGeneralInformation(): FormGroup {
        return this.generalInformation;
    }

    private setIssueRelationInformation(): void {
        this.issueRelationInformation = this.formBuilder.group({
            relatedIssue: [null, Validators.required],
            issueRelationType: [IssueRelationType.RELATED_TO, Validators.required],
        });
    }

    public getIssueRelationInformation(): FormGroup {
        return this.issueRelationInformation;
    }

    public compareIssues(issueA: {componentId: string, issueId: string}, issueB: {componentId: string, issueId: string}) {
        return issueA?.issueId === issueB?.issueId && issueA?.componentId === issueB?.componentId;
    }

    public updateIssueData() {
        const issue: IssuePartial = {
            title: this.generalInformation.controls.title.value,
            type: this.generalInformation.controls.issueType.value,
            textBody: this.generalInformation.controls.body.value,
        };
        this.api.updateIssue(this.data.component.id, this.data.issue.id, issue);
    }

    public addIssueRelation() {
        const form = this.getIssueRelationInformation().controls;
        const related = form.relatedIssue.value;
        this.api.addIssueRelation(
            this.data.component.id,
            this.data.issue.id,
            related.componentId,
            related.issueId,
            form.issueRelationType.value
        );
    }

    public removeIssueRelation(rel: IssueRelation) {
        this.api.removeIssueRelation(
            this.data.component.id,
            this.data.issue.id,
            rel,
        );
    }

}
