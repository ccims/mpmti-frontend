import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, Project } from '../reducers/state';
import { selectProject } from '../reducers/projects.selector';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-project-overview',
    templateUrl: './project-overview.component.html',
    styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

    project: Observable<Project>;


    constructor(private store: Store<State>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.project = this.route.paramMap.pipe(
            switchMap((paramMap) => this.store.pipe(select(selectProject, paramMap.get('project')))),
        );
    }

}
