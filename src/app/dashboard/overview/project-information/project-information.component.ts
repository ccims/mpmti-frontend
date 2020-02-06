import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/types/types-interfaces';

@Component({
    selector: 'app-project-information',
    templateUrl: './project-information.component.html',
    styleUrls: ['./project-information.component.css']
})
export class ProjectInformationComponent implements OnInit {

    @Input()
    private project: Project;

    constructor() { }

    ngOnInit() {
    }

}
