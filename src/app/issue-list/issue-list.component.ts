import { Component, OnInit, Input } from '@angular/core';
import { Project, ProjectComponent } from '../types/types-interfaces';

@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
    @Input()
    private project: Project;
    private components: ProjectComponent[];

    constructor() {
    }

    ngOnInit() {
        this.components = [
            {
                componentName: 'shopping-cart-service',
                interfaces: []
            },
            {
                componentName: 'order-service',
                interfaces: []
            },
            {
                componentName: 'shipping-service',
                interfaces: []
            },
            {
                componentName: 'payment-service',
                interfaces: []
            }
        ];
    }

    protected getProject(): Project {
        return this.project;
    }

    protected getComponents(): ProjectComponent[] {
        return this.components;
    }
}
