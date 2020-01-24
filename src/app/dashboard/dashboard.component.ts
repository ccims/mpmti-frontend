import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../types/types-interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private currentProject: Project;
  private openSidenavContent: string = 'DashboardOverview';
  private projects: Project[];

  constructor() {
  }

  ngOnInit() {
    // TODO load projects of user from backend
    this.projects = [
      {
        projectName: 'sandros-project',
        displayName: 'Sandro\'s Project'
      },
      {
        projectName: 'pse',
        displayName: 'PSE'
      },
      {
        projectName: 'pizza-calculator',
        displayName: 'PizzaCalculator'
      }
    ];
  }

  ngOnDestroy(): void {
  }

  private addNewProject(): void {
    // TODO Open dialog and ask user for project information
    // TODO Check project information and throw error if necessary
    // TODO create new project and send it to backend
    const project: Project = {
      projectName: 'some-project-name',
      displayName: 'Some project name'
    };
    // TODO if backend answeres with 201 add to projects, otherwise throw an error
    this.projects.push(project);
  }

  private setCurrentProjectAndOpenSidenavContentComponent(projectName: string, sidenavContentComponent: string) {
    this.projects.forEach((project) => {
      if (project.projectName === projectName) {
        this.currentProject = project;
      }
    });
    this.openSidenavContent = sidenavContentComponent;
  }

  private logout(): void {
    localStorage.removeItem('token'); // TODO implement correctly
  }
}
