import * as Uuid from 'uuid/v5';
import { State, Project, Component, Issue, IssueType, IssueLocationType, IssueRelationType } from './state';
import { PROJECT_UUID_NAMESPACE, COMPONENT_UUID_NAMESPACE, COMPONENT_INTERFACE_UUID_NAMESPACE, ISSUE_NAMESPACE_UUID_NAMESPACE } from './namespace-constants';


const compInterfaceUUIDShipping: string = Uuid('shipping-service-interface', COMPONENT_INTERFACE_UUID_NAMESPACE);
const compInterfaceUUIDPayment: string = Uuid('payment-service-interface', COMPONENT_INTERFACE_UUID_NAMESPACE);

const compOrderService: Component = {
    componentId: Uuid('order-service', COMPONENT_UUID_NAMESPACE),
    componentName: 'order-service',
    interfaces: {},
    componentRelations: [
        {
            targetId: compInterfaceUUIDShipping,
            targetType: 'interface',
        },
        {
            targetId: compInterfaceUUIDPayment,
            targetType: 'interface',
        },
    ],
};

const compShippingService: Component = {
    componentId: Uuid('shipping-service', COMPONENT_UUID_NAMESPACE),
    componentName: 'shipping-service',
    interfaces: {
        [compInterfaceUUIDShipping]: {
            interfaceId: compInterfaceUUIDShipping,
            interfaceName: 'shipping-service-interface',
        }
    },
    componentRelations: [
        {
            targetId: compInterfaceUUIDPayment,
            targetType: 'interface',
        },
    ],
};

const compPaymentService: Component = {
    componentId: Uuid('payment-service', COMPONENT_UUID_NAMESPACE),
    componentName: 'payment-service',
    interfaces: {
        [compInterfaceUUIDPayment]: {
            interfaceId: compInterfaceUUIDPayment,
            interfaceName: 'payment-service-interface',
        }
    },
    componentRelations: [],
};


const issueNamespaceA = Uuid('sandros-project', ISSUE_NAMESPACE_UUID_NAMESPACE);
const issueNamespaceB = Uuid('pse', ISSUE_NAMESPACE_UUID_NAMESPACE);
const issueNamespaceC = Uuid('pizza-calculator', ISSUE_NAMESPACE_UUID_NAMESPACE);

const projA: Project = {
    projectId: Uuid('sandros-project', PROJECT_UUID_NAMESPACE),

    projectName: 'sandros-project',
    displayName: 'Sandro\'s Project',
    projectOwnerName: 'Sandro',

    imsURL: 'github.com/sandros-project',
    imsProviderType: 'GitHub',
    imsOwnerName: 'Sandro',

    rsURL: 'github.com/sandros-project',
    rsProviderType: 'GitHub',
    rsOwnerName: 'Sandro',

    components: [
        compOrderService.componentId,
        compShippingService.componentId,
        compPaymentService.componentId,
    ],

    issueNamespace: issueNamespaceA,
};

const projB: Project = {
    projectId: Uuid('pse', PROJECT_UUID_NAMESPACE),

    projectName: 'pse',
    displayName: 'PSE',
    projectOwnerName: 'Sandro',

    imsURL: 'github.com/pse',
    imsProviderType: 'GitHub',
    imsOwnerName: 'Sandro',

    rsURL: 'github.com/pse',
    rsProviderType: 'GitHub',
    rsOwnerName: 'Sandro',

    components: [
        compOrderService.componentId,
        compShippingService.componentId,
        compPaymentService.componentId,
    ],

    issueNamespace: issueNamespaceB,
};

const projC: Project = {
    projectId: Uuid('pizza-calculator', PROJECT_UUID_NAMESPACE),

    projectName: 'pizza-calculator',
    displayName: 'PizzaCalculator',
    projectOwnerName: 'Sandro',

    imsURL: 'github.com/pizza-calculator',
    imsProviderType: 'GitHub',
    imsOwnerName: 'Sandro',

    rsURL: 'github.com/pizza-calculator',
    rsProviderType: 'GitHub',
    rsOwnerName: 'Sandro',

    components: [
        compOrderService.componentId,
        compShippingService.componentId,
        compPaymentService.componentId,
    ],

    issueNamespace: issueNamespaceC,
};



const issueTemplate: Issue = {
    issueId: 'TODO',
    title: '',
    type: IssueType.BUG,
    textBody: '',
    isOpen: true,
    relatedIssues: [],
    labels: [],
    locations: [],
    comments: [],
};

const issueA: Issue = {
    ...issueTemplate,
    title: 'order-service bug',
    textBody: 'problem in accessing shipping service API',
    locations: [
        {
            locationId: compOrderService.componentId,
            locationType: IssueLocationType.COMPONENT,
        }
    ]
};

const issueB: Issue = {
    ...issueTemplate,
    title: 'order-service feature request',
    textBody: 'updating to fr of shipping service API',
    type: IssueType.FEATURE_REQUEST,
    locations: [
        {
            locationId: compOrderService.componentId,
            locationType: IssueLocationType.COMPONENT,
        }
    ]
};

const issueC: Issue = {
    ...issueTemplate,
    title: 'shipping-service-interface bug',
    textBody: 'problem in API',
    locations: [
        {
            locationId: compShippingService.componentId,
            locationType: IssueLocationType.COMPONENT,
        },
        {
            locationId: compInterfaceUUIDShipping,
            locationType: IssueLocationType.COMPONENT_INTERFACE,
        },
    ],
};

const issueD: Issue = {
    ...issueTemplate,
    title: 'shipping-service bug',
    textBody: 'some problem within the component',
    locations: [
        {
            locationId: compShippingService.componentId,
            locationType: IssueLocationType.COMPONENT,
        },
    ],
};

const issueE: Issue = {
    ...issueTemplate,
    title: 'second shipping-service bug',
    textBody: 'some problem within the component',
    locations: [
        {
            locationId: compShippingService.componentId,
            locationType: IssueLocationType.COMPONENT,
        },
    ],
};

const issueF: Issue = {
    ...issueTemplate,
    title: 'cross-component feature request',
    textBody: 'applying to update in another API',
    locations: [
        {
            locationId: compOrderService.componentId,
            locationType: IssueLocationType.COMPONENT,
        },
        {
            locationId: compShippingService.componentId,
            locationType: IssueLocationType.COMPONENT,
        },
    ]
};



const issueG: Issue = {
    ...issueTemplate,
    title: 'payment-service-interface feature request',
    textBody: 'A new feature in this API',
    type: IssueType.FEATURE_REQUEST,
    locations: [
        {
            locationId: compPaymentService.componentId,
            locationType: IssueLocationType.COMPONENT,
        },
        {
            locationId: compInterfaceUUIDPayment,
            locationType: IssueLocationType.COMPONENT_INTERFACE,
        },
    ]
};


export const DEMO_INITIAL_STATE: State = {
    projects: {
        [projA.projectId]: projA,
        [projB.projectId]: projB,
        [projC.projectId]: projC,
    },
    components: {
        [compOrderService.componentId]: compOrderService,
        [compShippingService.componentId]: compShippingService,
        [compPaymentService.componentId]: compPaymentService,
    },
    issueNamespaces: {
        [issueNamespaceA]: {
            [Uuid(issueA.title, issueNamespaceA)]: {
                ...issueA,
                issueId: Uuid(issueA.title, issueNamespaceA),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueC.title, issueNamespaceA),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueB.title, issueNamespaceA)]: {
                ...issueB,
                issueId: Uuid(issueB.title, issueNamespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueC.title, issueNamespaceA)]: {
                ...issueC,
                issueId: Uuid(issueC.title, issueNamespaceA),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueD.title, issueNamespaceA),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueD.title, issueNamespaceA)]: {
                ...issueD,
                issueId: Uuid(issueD.title, issueNamespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueE.title, issueNamespaceA)]: {
                ...issueE,
                issueId: Uuid(issueE.title, issueNamespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueF.title, issueNamespaceA)]: {
                ...issueF,
                issueId: Uuid(issueF.title, issueNamespaceA),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueG.title, issueNamespaceA),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueG.title, issueNamespaceA)]: {
                ...issueG,
                issueId: Uuid(issueG.title, issueNamespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
        },
        [issueNamespaceB]: {
            [Uuid(issueA.title, issueNamespaceB)]: {
                ...issueA,
                issueId: Uuid(issueA.title, issueNamespaceB),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueC.title, issueNamespaceB),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueB.title, issueNamespaceB)]: {
                ...issueB,
                issueId: Uuid(issueB.title, issueNamespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueC.title, issueNamespaceB)]: {
                ...issueC,
                issueId: Uuid(issueC.title, issueNamespaceB),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueD.title, issueNamespaceB),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueD.title, issueNamespaceB)]: {
                ...issueD,
                issueId: Uuid(issueD.title, issueNamespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueE.title, issueNamespaceB)]: {
                ...issueE,
                issueId: Uuid(issueE.title, issueNamespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueF.title, issueNamespaceB)]: {
                ...issueF,
                issueId: Uuid(issueF.title, issueNamespaceB),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueG.title, issueNamespaceB),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueG.title, issueNamespaceB)]: {
                ...issueG,
                issueId: Uuid(issueG.title, issueNamespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
        },
        [issueNamespaceC]: {
            [Uuid(issueA.title, issueNamespaceC)]: {
                ...issueA,
                issueId: Uuid(issueA.title, issueNamespaceC),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueC.title, issueNamespaceC),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueB.title, issueNamespaceC)]: {
                ...issueB,
                issueId: Uuid(issueB.title, issueNamespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueC.title, issueNamespaceC)]: {
                ...issueC,
                issueId: Uuid(issueC.title, issueNamespaceC),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueD.title, issueNamespaceC),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueD.title, issueNamespaceC)]: {
                ...issueD,
                issueId: Uuid(issueD.title, issueNamespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueE.title, issueNamespaceC)]: {
                ...issueE,
                issueId: Uuid(issueE.title, issueNamespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueF.title, issueNamespaceC)]: {
                ...issueF,
                issueId: Uuid(issueF.title, issueNamespaceC),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueG.title, issueNamespaceC),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueG.title, issueNamespaceC)]: {
                ...issueG,
                issueId: Uuid(issueG.title, issueNamespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
        },
    },
    issueGraphs: {
        'A': {
        },
        'B': {
        },
        'C': {
        }
    },
};
