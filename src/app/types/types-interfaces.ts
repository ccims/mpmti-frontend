import { Issue } from '../model/issue';

export interface Token {
    token: string;
}

export interface IMSProviderType {
    value: string;
    viewValue: string;
}

export interface RSProviderType {
    value: string;
    viewValue: string;
}

export interface IMSCredential {
    username: string;
    providerType: string;
    credential: string;
}

export interface RSCredential {
    username: string;
    providerType: string;
    credential: string;
}

export interface Project {
    projectName: string;
    displayName: string;
}

export interface ProjectInformation {
    generalInformation: {
        projectName: string,
        displayName: string,
        projectOwnerName: string;
    };
    imsInformation: {
        imsURL: string,
        imsProviderType: string,
        imsOwnerName: string;
    };
    rsInformation: {
        rsURL: string,
        rsProviderType: string,
        rsOwnerName: string;
    };
}

export interface ProjectComponentInformation {
    generalInformation: {
        componentName: string,
        componentOwnerName: string;
    };
    imsInformation: {
        imsURL: string,
        imsProviderType: string,
        imsOwnerName: string;
    };
    rsInformation: {
        rsURL: string,
        rsProviderType: string,
        rsOwnerName: string;
    };
}

export interface ProjectComponent {
    componentName: string;
    uuid: string;
    interfaces: ProjectComponentInterface[];
}

export interface ProjectComponentInterface {
    interfaceName: string;
    uuid: string;
}

export interface SystemArchitectureEdgeListNode {
    componentUuid: string;
    edgesToInterfaces: string[];
    edgesToComponents: string[];
}

export interface IssueLink {
    issueID: string;
    relation: IssueRelation;
}

export interface Label {
    name: string;
}

export interface IssueLocation {
    componentID: string;
    interfaceID?: string;
}

export interface IssueComment {
    comment: string;
    annotator: string;
}

export enum IssueRelation {
    RELATED_TO = "RELATED_TO",
    DUPLICATES = "DUPLICATES",
    DEPENDS = "DEPENDS"
}
export enum IssueType {
    BUG = "BUG",
    FEATURE_REQUEST = "FEATURE_REQUEST",
    UNCLASSIFIED = "UNCLASSIFIED"
}
