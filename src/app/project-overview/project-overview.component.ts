import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../types/types-interfaces';

@Component({
    selector: 'app-project-overview',
    templateUrl: './project-overview.component.html',
    styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

    @Input()
    private project: Project;

    constructor() { }

    ngOnInit() {
    }

    public getProject(): Project {
        return this.project;
    }

}
