import { Component, OnInit, Input } from '@angular/core';
import { Project, ProjectComponent } from '../types/types-interfaces';
import * as Uuid from 'uuid/v5';

@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
    @Input()
    project: Project;
    components: ProjectComponent[];
    private readonly UUID_NAMESPACE: string = '005640e5-a15f-475e-b95f-73ef41c611fa';

    constructor() {
    }

    ngOnInit() {
        this.components = [
            {
                componentName: 'shopping-cart-service',
                uuid: Uuid('shopping-cart-service', this.UUID_NAMESPACE),
                interfaces: []
            },
            {
                componentName: 'order-service',
                uuid: Uuid('order-service', this.UUID_NAMESPACE),
                interfaces: [
                    {
                        interfaceName: 'order-service-interface',
                        uuid: Uuid('order-service-interface', this.UUID_NAMESPACE)
                    }
                ]
            },
            {
                componentName: 'shipping-service',
                uuid: Uuid('shipping-service', this.UUID_NAMESPACE),
                interfaces: [
                    {
                        interfaceName: 'shipping-service-interface',
                        uuid: Uuid('shipping-service-interface', this.UUID_NAMESPACE)
                    }
                ]
            },
            {
                componentName: 'payment-service',
                uuid: Uuid('payment-service', this.UUID_NAMESPACE),
                interfaces: [
                    {
                        interfaceName: 'payment-service-interface',
                        uuid: Uuid('payment-service-interface', this.UUID_NAMESPACE)
                    }
                ]
            }
        ];
    }

    public getProject(): Project {
        return this.project;
    }

    public getComponents(): ProjectComponent[] {
        return this.components;
    }
}
