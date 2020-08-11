import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { State, Project } from '../reducers/state';
import { switchMap, map } from 'rxjs/operators';
import { selectProject } from '../reducers/projects.selector';
import { ApiService } from '../api/api.service';

@Component({
    selector: 'app-project-issues',
    templateUrl: './project-issues.component.html',
    styleUrls: ['./project-issues.component.css']
})
export class ProjectIssuesComponent implements OnInit {

    project: Observable<Project>;


    constructor(private store: Store<State>, private route: ActivatedRoute, private api: ApiService) { }

    ngOnInit() {
        this.project = this.route.paramMap.pipe(
            map(paramMap => {
                const projectId = paramMap.get('project');
                if (projectId != null && projectId !== '') {
                    this.api.loadFullProject(projectId);
                }
                return paramMap;
            }),
            switchMap((paramMap) => this.store.pipe(select(selectProject, paramMap.get('project')))),
        );
    }

}
