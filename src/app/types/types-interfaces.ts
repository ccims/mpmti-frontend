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
export interface ProjectComponentInformation {
    generalInformation: {
        componentName: string,
        componentOwnerName: string
    };
    imsInformation: {
        imsURL: string,
        imsProviderType: string,
        imsOwnerName: string
    };
    rsInformation: {
        rsURL: string,
        rsProviderType: string,
        rsOwnerName: string
    };
}

export interface ProjectComponent {
    componentName: string;
    interfaces: ProjectComponentInterface[];
}

export interface ProjectComponentInterface {
    interfaceName: string;
}

export interface SystemArchitectureEdgeListNode {
    componentName: string;
    edgesToInterfaces: string[];
    edgesToComponents: string[];
}
