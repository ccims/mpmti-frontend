import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Project, ProjectInformation } from '../types/types-interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from '../dialogs/create-project-dialog/create-project-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    private username: string;
    private currentProject: ProjectInformation;
    private openSidenavContent: string = 'DashboardOverview';
    private projects: ProjectInformation[];

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        this.username = localStorage.getItem('username');

        // TODO load projects of user from backend
        this.projects = [
            {
                generalInformation: {
                    projectName: 'sandros-project',
                    displayName: 'Sandro\'s Project',
                    projectOwnerName: 'Sandro'
                },
                imsInformation: {
                    imsURL: 'github.com/sandros-project',
                    imsProviderType: 'GitHub',
                    imsOwnerName: 'Sandro'
                },
                rsInformation: {
                    rsURL: 'github.com/sandros-project',
                    rsProviderType: 'GitHub',
                    rsOwnerName: 'Sandro'
                }
            },
            {
                generalInformation: {
                    projectName: 'pse',
                    displayName: 'PSE',
                    projectOwnerName: 'Sandro'
                },
                imsInformation: {
                    imsURL: 'github.com/pse',
                    imsProviderType: 'GitHub',
                    imsOwnerName: 'Sandro'
                },
                rsInformation: {
                    rsURL: 'github.com/pse',
                    rsProviderType: 'GitHub',
                    rsOwnerName: 'Sandro'
                }
            },
            {
                generalInformation: {
                    projectName: 'pizza-calculator',
                    displayName: 'PizzaCalculator',
                    projectOwnerName: 'Sandro'
                },
                imsInformation: {
                    imsURL: 'github.com/pizza-calculator',
                    imsProviderType: 'GitHub',
                    imsOwnerName: 'Sandro'
                },
                rsInformation: {
                    rsURL: 'github.com/pizza-calculator',
                    rsProviderType: 'GitHub',
                    rsOwnerName: 'Sandro'
                }
            }
        ];
    }

    ngOnDestroy(): void {
    }

    onCreateProjectDialog(): void {
        const createProjectDialog = this.dialog.open(CreateProjectDialogComponent);

        createProjectDialog.afterClosed().subscribe(projectInformation => {
            // TODO create project and add to sidenav
            if (projectInformation) {
                this.addNewProject(projectInformation);
            }
        });
    }

    private addNewProject(projectInformation: ProjectInformation): void {
        const project: ProjectInformation = projectInformation;
        project.generalInformation.projectOwnerName = this.username;
        // TODO send 'project' it to backend
        // TODO if backend answeres with 201 add to projects, otherwise throw an error
        this.projects.push(project);
    }

    protected setCurrentProjectAndOpenSidenavContentComponent(projectName: string, sidenavContentComponent: string) {
        this.projects.forEach((project) => {
            if (project.generalInformation.projectName === projectName) {
                this.currentProject = project;
            }
        });
        this.openSidenavContent = sidenavContentComponent;
    }

    protected logout(): void {
        localStorage.removeItem('username');
        localStorage.removeItem('token'); // TODO implement correctly
    }
    protected getProjects(): ProjectInformation[] {
        return this.projects;
    }

    protected getOpenSidenavContent(): string {
        return this.openSidenavContent;
    }

    protected getCurrentProject(): ProjectInformation {
        return this.currentProject;
    }
}
