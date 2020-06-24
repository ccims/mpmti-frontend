import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueDialogComponent } from './edit-issue-dialog.component';

describe('EditIssueDialogComponent', () => {
    let component: EditIssueDialogComponent;
    let fixture: ComponentFixture<EditIssueDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditIssueDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditIssueDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
