import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { State, Project } from '../reducers/state';
import { switchMap } from 'rxjs/operators';
import { selectProject } from '../reducers/projects.selector';

@Component({
    selector: 'app-project-issues',
    templateUrl: './project-issues.component.html',
    styleUrls: ['./project-issues.component.css']
})
export class ProjectIssuesComponent implements OnInit {

    project: Observable<Project>;


    constructor(private store: Store<State>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.project = this.route.paramMap.pipe(
            switchMap((paramMap) => this.store.pipe(select(selectProject, paramMap.get('project')))),
        );
    }

}
