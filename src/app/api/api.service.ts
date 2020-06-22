import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';
import { State } from '../reducers/state';
import gql from 'graphql-tag';
import { ProjectPartial, addProject } from '../reducers/projects.actions';

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

enum GqRelationType {
    RELATED_TO,
    DUPLICATES,
    DEPENDS,
}

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

const projectList = gql`
    query projectList {
        projects {
            id
            name
            description
            ownerUsername
            components {
                name
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

    public getProjects() {
        this.apollo.query<GqRoot>({
            query: projectList,
        }).subscribe(projects => {
            console.log(projects.data);
            projects.data.projects?.forEach(proj => {
                const project: ProjectPartial = {
                    id: proj.id,
                    name: proj.name,
                    description: proj.description,
                    projectOwnerName: proj.ownerUsername,
                    components: [],
                };
                proj.components.forEach(comp => {
                    project.components.push(comp.id);
                });
                this.store.dispatch(addProject({
                    projectId: proj.id,
                    project: project,
                }));
            });
        });
    }
}
