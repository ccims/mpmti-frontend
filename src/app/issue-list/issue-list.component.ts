import { Component, OnInit } from '@angular/core';
import { Project } from '../types/types-interfaces';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  private projects: Project[]; // TODO get projects from dashboard over project-issues component

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

}
