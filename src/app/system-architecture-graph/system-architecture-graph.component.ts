import { Component, OnInit, Input } from '@angular/core';
import {
    Project, ProjectComponent, ProjectComponentInterface, SystemArchitectureEdgeListNode,
    IssueType, IssueRelation
} from '../types/types-interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponentDialogComponent } from '../dialogs/create-component-dialog/create-component-dialog.component';
import * as Uuid from 'uuid/v5';
import { Issue } from '../model/issue';

@Component({
    selector: 'app-system-architecture-graph',
    templateUrl: './system-architecture-graph.component.html',
    styleUrls: ['./system-architecture-graph.component.css']
})
export class SystemArchitectureGraphComponent implements OnInit {

    @Input()
    project: Project;
    components: ProjectComponent[]; // TODO ask backend for list of project's components
    systemArchitectureGraphEdges: SystemArchitectureEdgeListNode[]; // TODO ask backend for system architecture edge list
    issues: Issue[]; // TODO ask backend for issue list
    private readonly UUID_NAMESPACE: string = '005640e5-a15f-475e-b95f-73ef41c611fa';

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
        this.components = [
            {
                componentName: 'order-service',
                uuid: Uuid('order-service', this.UUID_NAMESPACE),
                interfaces: []
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
        this.systemArchitectureGraphEdges = [
            {
                componentUuid: Uuid('order-service', this.UUID_NAMESPACE),
                edgesToInterfaces: [
                    Uuid('shipping-service-interface', this.UUID_NAMESPACE),
                    Uuid('payment-service-interface', this.UUID_NAMESPACE)
                ],
                edgesToComponents: []
            },
            {
                componentUuid: Uuid('shipping-service', this.UUID_NAMESPACE),
                edgesToInterfaces: [Uuid('payment-service-interface', this.UUID_NAMESPACE)],
                edgesToComponents: []
            },
            {
                componentUuid: Uuid('payment-service', this.UUID_NAMESPACE),
                edgesToInterfaces: [],
                edgesToComponents: []
            }
        ];
        this.issues = [
            new Issue('order-service bug', 'problem in accessing shipping service API', true,
                [
                    {
                        issueID: Uuid('shipping-service-interface bugproblem in API', this.UUID_NAMESPACE),
                        relation: IssueRelation.DEPENDS
                    }
                ], IssueType.BUG, [], [
                { componentID: Uuid('order-service', this.UUID_NAMESPACE) }
            ], []),
            new Issue('order-service feature request', 'updating to fr of shipping service API', true,
                [], IssueType.FEATURE_REQUEST, [], [
                { componentID: Uuid('order-service', this.UUID_NAMESPACE) }
            ], []),
            new Issue('shipping-service-interface bug', 'problem in API', true,
                [
                    {
                        issueID: Uuid('shipping-service bugsome problem within the component', this.UUID_NAMESPACE),
                        relation: IssueRelation.DEPENDS
                    }
                ], IssueType.BUG, [], [
                {
                    componentID: Uuid('shipping-service', this.UUID_NAMESPACE),
                    interfaceID: Uuid('shipping-service-interface', this.UUID_NAMESPACE)
                }
            ], []),
            new Issue('shipping-service bug', 'some problem within the component', true,
                [], IssueType.BUG, [], [
                {
                    componentID: Uuid('shipping-service', this.UUID_NAMESPACE),
                }
            ], []),
            new Issue('second shipping-service bug', 'some problem within the component', true,
                [], IssueType.BUG, [], [
                {
                    componentID: Uuid('shipping-service', this.UUID_NAMESPACE),
                }
            ], []),
            new Issue('cross-component feature request', 'applying to update in another API', true,
                [
                    {
                        issueID: Uuid('payment-service-interface feature requestA new feature in this API', this.UUID_NAMESPACE),
                        relation: IssueRelation.DEPENDS
                    }
                ], IssueType.FEATURE_REQUEST, [], [
                { componentID: Uuid('order-service', this.UUID_NAMESPACE) },
                { componentID: Uuid('shipping-service', this.UUID_NAMESPACE) }
            ], []),
            new Issue('payment-service-interface feature request', 'A new feature in this API', true,
                [], IssueType.FEATURE_REQUEST, [], [
                {
                    componentID: Uuid('payment-service', this.UUID_NAMESPACE),
                    interfaceID: Uuid('payment-service-interface', this.UUID_NAMESPACE)
                }
            ], []),
        ];

        // #### Other data ####

        // this.components = [
        //     {
        //         componentName: 'shopping-cart-service',
        //         uuid: Uuid('shopping-cart-service', this.UUID_NAMESPACE),
        //         interfaces: []
        //     },
        //     {
        //         componentName: 'order-service',
        //         uuid: Uuid('order-service', this.UUID_NAMESPACE),
        //         interfaces: [
        //             {
        //                 interfaceName: 'order-service-interface',
        //                 uuid: Uuid('order-service-interface', this.UUID_NAMESPACE)
        //             }
        //         ]
        //     },
        //     {
        //         componentName: 'shipping-service',
        //         uuid: Uuid('shipping-service', this.UUID_NAMESPACE),
        //         interfaces: [
        //             {
        //                 interfaceName: 'shipping-service-interface',
        //                 uuid: Uuid('shipping-service-interface', this.UUID_NAMESPACE)
        //             }
        //         ]
        //     },
        //     {
        //         componentName: 'payment-service',
        //         uuid: Uuid('payment-service', this.UUID_NAMESPACE),
        //         interfaces: [
        //             {
        //                 interfaceName: 'payment-service-interface',
        //                 uuid: Uuid('payment-service-interface', this.UUID_NAMESPACE)
        //             }
        //         ]
        //     }
        // ];
        // this.systemArchitectureGraphEdges = [
        //     {
        //         componentUuid: Uuid('shopping-cart-service', this.UUID_NAMESPACE),
        //         edgesToInterfaces: [Uuid('order-service-interface', this.UUID_NAMESPACE)],
        //         edgesToComponents: []
        //     },
        //     {
        //         componentUuid: Uuid('order-service', this.UUID_NAMESPACE),
        //         edgesToInterfaces: [
        //             Uuid('shipping-service-interface', this.UUID_NAMESPACE),
        //             Uuid('payment-service-interface', this.UUID_NAMESPACE)
        //         ],
        //         edgesToComponents: []
        //     },
        //     {
        //         componentUuid: Uuid('shipping-service', this.UUID_NAMESPACE),
        //         edgesToInterfaces: [Uuid('payment-service-interface', this.UUID_NAMESPACE)],
        //         edgesToComponents: []
        //     },
        //     {
        //         componentUuid: Uuid('payment-service', this.UUID_NAMESPACE),
        //         edgesToInterfaces: [],
        //         edgesToComponents: []
        //     }
        // ];
        // this.issues = [
        //     new Issue('Some title', 'Hello, I am the first bug report', true,
        //         [
        //             {
        //                 issueID: Uuid('Some issue for an interfaceHello, I am the first bug report at an interface', this.UUID_NAMESPACE),
        //                 relation: IssueRelation.DEPENDS
        //             }
        //         ], IssueType.BUG, [],
        //         [
        //             { componentID: Uuid('shopping-cart-service', this.UUID_NAMESPACE) }
        //         ], []),
        //     new Issue('Some FR title', 'Hello, I am the first feature request', true, [], IssueType.FEATURE_REQUEST, [], [
        //         { componentID: Uuid('shopping-cart-service', this.UUID_NAMESPACE) }
        //     ], []),
        //     new Issue('Some issue for an interface', 'Hello, I am the first bug report at an interface', true, [{
        //         issueID: Uuid('Some issue for the order-serviceHello, I am an issue in the order-service', this.UUID_NAMESPACE),
        //         relation: IssueRelation.DEPENDS
        //     }], IssueType.BUG, [], [
        //         {
        //             componentID: Uuid('order-service', this.UUID_NAMESPACE),
        //             interfaceID: Uuid('order-service-interface', this.UUID_NAMESPACE)
        //         }
        //     ], []),
        //     new Issue('Some issue for the order-service', 'Hello, I am an issue in the order-service', true, [], IssueType.BUG, [], [
        //         {
        //             componentID: Uuid('order-service', this.UUID_NAMESPACE),
        //         }
        //     ], []),
        //     new Issue('Some other title', 'Hello, I am the second bug report', true, [], IssueType.BUG, [], [
        //         { componentID: Uuid('shipping-service', this.UUID_NAMESPACE) }
        //     ], []),
        //     new Issue('The second shipping service issue', 'Hello, I am the second bug report for the shipping service', true, [],
        //         IssueType.BUG, [], [
        //         { componentID: Uuid('shipping-service', this.UUID_NAMESPACE) }
        //     ], []),
        // ];
    }

    public openCreateComponentDialog(): void {
        const createComponentDialog = this.dialog.open(CreateComponentDialogComponent);

        createComponentDialog.afterClosed().subscribe(componentInformation => {
            // TODO add component to project, update graph and backend
            if (componentInformation) {
                console.log(`Dialog result: ${componentInformation.generalInformation.componentName}`);
            }
        });
    }
}
