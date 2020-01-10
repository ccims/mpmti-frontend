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
