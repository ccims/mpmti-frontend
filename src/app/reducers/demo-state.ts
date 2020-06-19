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

    issueNamespace: 'sandros-project',
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

    issueNamespace: 'pse',
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

    issueNamespace: 'pizza-calculator',
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


const namespaceA = Uuid('A', ISSUE_NAMESPACE_UUID_NAMESPACE);
const namespaceB = Uuid('B', ISSUE_NAMESPACE_UUID_NAMESPACE);
const namespaceC = Uuid('C', ISSUE_NAMESPACE_UUID_NAMESPACE);


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
        'A': {
            [Uuid(issueA.title, namespaceA)]: {
                ...issueA,
                issueId: Uuid(issueA.title, namespaceA),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueC.title, namespaceA),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueB.title, namespaceA)]: {
                ...issueB,
                issueId: Uuid(issueB.title, namespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueC.title, namespaceA)]: {
                ...issueC,
                issueId: Uuid(issueC.title, namespaceA),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueD.title, namespaceA),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueD.title, namespaceA)]: {
                ...issueD,
                issueId: Uuid(issueD.title, namespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueE.title, namespaceA)]: {
                ...issueE,
                issueId: Uuid(issueE.title, namespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueF.title, namespaceA)]: {
                ...issueF,
                issueId: Uuid(issueF.title, namespaceA),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueG.title, namespaceA),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueG.title, namespaceA)]: {
                ...issueG,
                issueId: Uuid(issueG.title, namespaceA),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
        },
        'B': {
            [Uuid(issueA.title, namespaceB)]: {
                ...issueA,
                issueId: Uuid(issueA.title, namespaceB),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueC.title, namespaceB),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueB.title, namespaceB)]: {
                ...issueB,
                issueId: Uuid(issueB.title, namespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueC.title, namespaceB)]: {
                ...issueC,
                issueId: Uuid(issueC.title, namespaceB),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueD.title, namespaceB),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueD.title, namespaceB)]: {
                ...issueD,
                issueId: Uuid(issueD.title, namespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueE.title, namespaceB)]: {
                ...issueE,
                issueId: Uuid(issueE.title, namespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueF.title, namespaceB)]: {
                ...issueF,
                issueId: Uuid(issueF.title, namespaceB),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueG.title, namespaceB),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueG.title, namespaceB)]: {
                ...issueG,
                issueId: Uuid(issueG.title, namespaceB),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
        },
        'C': {
            [Uuid(issueA.title, namespaceC)]: {
                ...issueA,
                issueId: Uuid(issueA.title, namespaceC),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueC.title, namespaceC),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueB.title, namespaceC)]: {
                ...issueB,
                issueId: Uuid(issueB.title, namespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueC.title, namespaceC)]: {
                ...issueC,
                issueId: Uuid(issueC.title, namespaceC),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueD.title, namespaceC),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueD.title, namespaceC)]: {
                ...issueD,
                issueId: Uuid(issueD.title, namespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueE.title, namespaceC)]: {
                ...issueE,
                issueId: Uuid(issueE.title, namespaceC),
                relatedIssues: [],
                comments: [],
                labels: [],
            },
            [Uuid(issueF.title, namespaceC)]: {
                ...issueF,
                issueId: Uuid(issueF.title, namespaceC),
                relatedIssues: [
                    {
                        relatedIssueID: Uuid(issueG.title, namespaceC),
                        relationType: IssueRelationType.DEPENDS,
                    }
                ],
                comments: [],
                labels: [],
            },
            [Uuid(issueG.title, namespaceC)]: {
                ...issueG,
                issueId: Uuid(issueG.title, namespaceC),
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
