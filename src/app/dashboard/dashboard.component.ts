import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from '../dialogs/create-project-dialog-demo/create-project-dialog.component';
import { Store, select } from '@ngrx/store';
import { State, Project } from '../reducers/state';
import { selectProjectList } from '../reducers/projects.selector';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { ProjectPartial } from '../reducers/projects.actions';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    private username: string;
    //private projects: ProjectInformation[];
    public projectList: Observable<Project[]>;

    constructor(public dialog: MatDialog, private store: Store<State>, private api: ApiService) {
    }

    ngOnInit() {
        this.username = localStorage.getItem('username');

        this.api.loadProjectList();

        this.projectList = this.store.pipe(select(selectProjectList));

        // TODO load projects of user from backend
        let projects = [
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
        const createProjectDialog: MatDialogRef<CreateProjectDialogComponent, ProjectPartial> = this.dialog.open(CreateProjectDialogComponent);

        createProjectDialog.afterClosed().subscribe(projectInformation => {
            // TODO create project and add to sidenav
            if (projectInformation) {
                this.addNewProject(projectInformation);
            }
        });
    }

    private addNewProject(projectInformation: ProjectPartial): void {
        this.api.addProject(projectInformation);
    }

    removeProject(projectId: string): void {
        this.api.removeProject(projectId);
    }

    public logout(): void {
        localStorage.removeItem('username');
        localStorage.removeItem('token'); // TODO implement correctly
    }
}
