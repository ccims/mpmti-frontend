import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo } from 'apollo-angular';
import { Store, Action } from '@ngrx/store';
import { State, ComponentInterface, IssueType, IssueRelationType } from '../reducers/state';
import gql from 'graphql-tag';
import { ProjectPartial, addProject, setProjectList, removeProject, updateProject } from '../reducers/projects.actions';
import { ComponentPartial, addComponent, updateComponent } from '../reducers/components.actions';
import { IssuePartial, updateIssue } from '../reducers/issue-namespace.actions';

interface GqUser {
    id: string;
    userName: string;
    components?: GqComponent[];
    projects?: GqProject[];
    ims?: GqIMS[];
}

enum GqImsType {
    GitHub
}

interface GqIMS {
    id: string;
    type: GqImsType;
}

interface GqComment {
    id: string;
    author?: GqUser;
    text?: string;
    textRendered?: string;
}

enum GqIssueType {
    UNCLASSIFIED,
    BUG,
    FEATURE_REQUEST,
}
const GqIssueTypeToIssueType = {
    [GqIssueType.UNCLASSIFIED]: IssueType.UNCLASSIFIED,
    [GqIssueType.BUG]: IssueType.BUG,
    [GqIssueType.FEATURE_REQUEST]: IssueType.FEATURE_REQUEST,
};

enum GqRelationType {
    RELATED_TO,
    DUPLICATES,
    DEPENDS,
}
const GqRelationTypeToIssueRelationType = {
    [GqRelationType.RELATED_TO]: IssueRelationType.RELATED_TO,
    [GqRelationType.DEPENDS]: IssueRelationType.DEPENDS,
    [GqRelationType.DUPLICATES]: IssueRelationType.DUPLICATES,
};

interface GqIssueRelation {
    sourceIssue?: GqIssue;
    destIssue: GqIssue;
    relationType: GqRelationType;
}

interface GqIssue {
    id: string;
    title: string;
    body?: string;
    bodyRendered?: string;
    comments?: GqComment[];
    opened: boolean;
    issueType: GqIssueType;
    relatedIssues?: GqIssueRelation[];
    creationDate?: string;
}

interface GqInterface {
    id: string;
    name: string;
    hostComponent?: GqComponent;
    usingComponents?: GqComponent[];
}

interface GqComponent {
    id: string;
    name: string;
    description?: string;
    issues?: GqIssue[];
    projects?: GqProject[];
    ims?: GqIMS;
    interfaces?: GqInterface[];
    usedInterfaces?: GqInterface[];
}

interface GqProject {
    id: string;
    name: string;
    description?: string;
    ownerUsername?: string;
    components?: GqComponent[];
}

interface GqRoot {
    projects?: GqProject[];
}

const projectListQuery = gql`
    query projectList {
        projects {
            id
            name
            description
            ownerUsername
            components {
                id
            }
        }
    }
`;

const addProjectMutation = gql`
    mutation addProject($name: String!, $description: String, $projectOwnerName: String!,) {
        createProject(data: {
            name: $name
            description: $description
            ownerUsername: $projectOwnerName
        }) {
            id
            name
            description
            ownerUsername
        }
    }
`;

const removeProjectMutation = gql`
    mutation removeProject($projectId: ID!,) {
        removeProject(projectId: $projectId)
    }
`;

const fullProjectQuery = gql`
    query projectList { #($projectId: ID!)
        projects {
            id
            name
            description
            ownerUsername
            components {
                id
                name
                description
                issues {
                    id
                    title
                    body
                    bodyRendered
                    opened
                    creationDate
                    issueType
                    comments {
                        id
                    }
                    relatedIssues {
                        destIssue {
                            id
                        }
                        relationType
                    }
                }
                ims {
                    id
                    type
                }
                interfaces {
                    id
                    name
                }
                usedInterfaces {
                    id
                }
            }
        }
    }
`;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

    constructor(private jwtHelper: JwtHelperService, private apollo: Apollo, private store: Store<State>) { }

    /**
     *  Operation to check whether the user is authenticated or not.
     */
    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        /*          // Check whether the token is expired and return
                // true or false
                return !this.jwtHelper.isTokenExpired(token); */
        return token === 'test-token';
    }

    private gqProjectToProjectPartial(project: GqProject): ProjectPartial {
        const proj: ProjectPartial = {
            id: project.id,
            name: project.name,
            description: project.description,
            projectOwnerName: project.ownerUsername,
            components: [],
        };
        project.components?.forEach(comp => {
            proj.components.push(comp.id);
        });
        return proj;
    }

    private gqComponentToComponentPartial(component: GqComponent): ComponentPartial {
        const comp: ComponentPartial = {
            id: component.id,
            name: component.name,
            description: component.description,
            issues: [],
            issueManagementSystem: component.ims?.id,
            interfaces: {},
            componentRelations: [],
        };
        component.issues?.forEach(issue => {
            comp.issues.push(issue.id);
        });
        component.interfaces?.forEach(inter => {
            comp.interfaces[inter.id] = this.gqInterfaceToComponentInterface(inter);
        });
        component.usedInterfaces?.forEach(inter => {
            comp.componentRelations.push({
                targetId: inter.id,
                targetType: 'interface',
            });
        });
        return comp;
    }

    private gqInterfaceToComponentInterface(componentInterface: GqInterface): ComponentInterface {
        const inter = {
            interfaceId: componentInterface.id,
            interfaceName: componentInterface.name,
            issues: [],
        };
        return inter;
    }

    private gqIssueToIssuePartial(issue: GqIssue): IssuePartial {
        const iss: IssuePartial = {
            id: issue.id,
            title: issue.title,
            isOpen: issue.opened,
            type: GqIssueTypeToIssueType[issue.issueType],
            textBody: issue.body,
            htmlBody: issue.bodyRendered,
            relatedIssues: [],
            comments: [], // TODO
            labels: [], // TODO
        };
        issue.relatedIssues.forEach(rel => {
            iss.relatedIssues.push({
                relatedIssueID: rel.destIssue.id,
                relationType: GqRelationTypeToIssueRelationType[rel.relationType],
            });
        });
        // TODO populate other list fields
        return iss;
    }

    public loadProjectList() {
        this.apollo.query<GqRoot>({
            query: projectListQuery,
        }).subscribe(projects => {
            const projectList = [];
            projects.data.projects?.forEach(proj => {
                const project: ProjectPartial = this.gqProjectToProjectPartial(proj);
                projectList.push(project);
            });
            if (projectList.length > 0) {
                // only remove demo projects if database has projects
                this.store.dispatch(setProjectList({
                    projects: projectList,
                }));
            }
        });
    }

    public loadFullProject(projectId: string) {
        this.apollo.query<GqRoot>({
            query: fullProjectQuery,
            //variables: {
            //    projectId: projectId,
            //}
        }).subscribe(result => {
            const storeActions: Action[] = [];

            const proj = result.data.projects.filter(pr => pr.id === projectId)[0];

            const project = this.gqProjectToProjectPartial(proj);
            storeActions.push(updateProject({projectId: project.id, project: project}));

            proj.components.forEach(comp => {
                const component = this.gqComponentToComponentPartial(comp);
                storeActions.push(updateComponent({componentId: component.id, component: component}));
                comp.issues.forEach(iss => {
                    const issue = this.gqIssueToIssuePartial(iss);
                    storeActions.push(updateIssue({issueId: issue.id, issue: issue}));
                });
            });

            storeActions.forEach(action => this.store.dispatch(action));
        });
    }

    public addProject(project: ProjectPartial) {
        this.apollo.mutate<{createProject: GqProject}>({
            mutation: addProjectMutation,
            variables: project,
        }).subscribe(result => {
            const proj: ProjectPartial = this.gqProjectToProjectPartial(result.data.createProject);
            this.store.dispatch(addProject({
                projectId: proj.id,
                project: proj,
            }));
        });
    }

    public removeProject(projectId: string) {
        this.apollo.mutate<{createProject: GqProject}>({
            mutation: removeProjectMutation,
            variables: {
                projectId: projectId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeProject({
                    projectId: projectId
                }));
            }
        });
    }



    public addComponent(projectId: string, component: ComponentPartial) {

    }
}
