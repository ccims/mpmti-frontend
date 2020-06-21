

export interface Project {

    id: string;

    // general information
    name: string;
    description: string;
    projectOwnerName: string;

    // imsInformation
    //imsURL: string;
    //imsProviderType: string;
    //imsOwnerName: string;

    // rsInformation
    //rsURL: string;
    //rsProviderType: string;
    //rsOwnerName: string;

    components: string[];

    // state related information
}

export interface ProjectsState {
    [projectId: string]: Project;
}


export interface ComponentInterface {

    interfaceId: string;

    interfaceName: string;
    issues: string[];
}

export interface ComponentInterfaces {
    [interfaceId: string]: ComponentInterface;
}

export interface ComponentRelation {
    targetId: string;
    targetType: 'interface'|'component';
}

export interface Component {

    id: string;

    name: string;
    description: string;

    issueManagementSystem: string;
    issues: string[];

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
    author: string;
    text: string;
    html: string;
}

export enum IssueType {
    UNCLASSIFIED,
    BUG,
    FEATURE_REQUEST,
}

export interface Issue {

    id: string;

    title: string;
    textBody: string;
    htmlBody: string;
    type: IssueType;
    isOpen: boolean;
    relatedIssues: IssueRelation[];
    labels: IssueLabel[];
    comments: IssueComment[];
}

export interface IssuesState {
    [issueId: string]: Issue;
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
    issues: IssuesState;
    issueGraphs: IssueGraphsState;
}
