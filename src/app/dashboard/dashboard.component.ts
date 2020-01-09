import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../types/types-interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private projects: Project[];

  constructor() {
  }

  ngOnInit() {
    this.projects = [
      {
        projectName: 'Sandro\'s Project'
      },
      {
        projectName: 'PSE'
      },
      {
        projectName: 'PizzaCalculator'
      }
    ];
  }

  ngOnDestroy(): void {
  }

  addNewProject(): void {
    // TODO Open dialog and ask user for project information
    // TODO Check project information and throw error if necessary
    // TODO create new project and send it to backend
    const project: Project = {
      projectName: 'Some project name'
    };
    // TODO if backend answeres with 201 add to projects, otherwise throw an error
    this.projects.push(project);
  }
}
