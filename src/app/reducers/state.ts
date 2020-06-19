

export interface Project {

    projectId: string;

    // general information
    projectName: string;
    displayName: string;
    projectOwnerName: string;

    // imsInformation
    imsURL: string;
    imsProviderType: string;
    imsOwnerName: string;

    // rsInformation
    rsURL: string;
    rsProviderType: string;
    rsOwnerName: string;

    components: string[];

    // state related information
    issueNamespace: string;
}

export interface ProjectsState {
    [projectId: string]: Project;
}


export interface ComponentInterface {

    interfaceId: string;

    interfaceName: string;
}

export interface ComponentInterfaces {
    [interfaceId: string]: ComponentInterface;
}

export interface ComponentRelation {
    targetId: string;
    targetType: 'interface'|'component';
}

export interface Component {

    componentId: string;

    componentName: string;

    interfaces: ComponentInterfaces;

    componentRelations: ComponentRelation[];
}

export interface ComponentsState {
    [componentId: string]: Component;
}

export enum IssueRelationType {
    RELATED_TO,
    DUPLICATES,
    DEPENDS,
}

export interface IssueRelation {
    relationType: IssueRelationType;
    relatedIssueID: string;
}

export interface IssueLabel {
    name: string;
}

export enum IssueLocationType {
    COMPONENT,
    COMPONENT_INTERFACE,
}

export interface IssueLocation {
    locationId: string;
    locationType: IssueLocationType;
}

export interface IssueComment {
    comment: string;
    annotator: string;
}

export enum IssueType {
    UNCLASSIFIED,
    BUG,
    FEATURE_REQUEST,
}

export interface Issue {

    issueId: string;

    title: string;
    type: IssueType;
    textBody: string;
    isOpen: boolean;
    relatedIssues: IssueRelation[];
    labels: IssueLabel[];
    locations: IssueLocation[];
    comments: IssueComment[];
}

export interface IssuesState {
    [issueId: string]: Issue;
}

export interface IssueNamespacesState {
    [namespace: string]: IssuesState;
}

export interface IssueGraph {
    // TODO node positions and metadata

}

export interface IssueGraphsState {
    [graphId: string]: IssueGraph;
}

export interface State {
    projects: ProjectsState;
    components: ComponentsState;
    issueNamespaces: IssueNamespacesState;
    issueGraphs: IssueGraphsState;
}
