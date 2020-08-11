import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as Uuid from 'uuid/v5';
import { Project, Component as ProjectComponent, State } from '../reducers/state';
import { Store, select } from '@ngrx/store';
import { selectProjectComponentList } from '../reducers/components.selector';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnChanges {
    @Input()
    project: Project;
    components: Observable<ProjectComponent[]>;

    constructor(private store: Store<State>) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.project.previousValue?.id !== changes.project.currentValue?.id) {
            this.components = this.store.pipe(select(selectProjectComponentList, this.project?.id));
        }
    }
}
