import { Component, OnInit, Input } from '@angular/core';
import { Project, ProjectComponent, ProjectComponentInterface } from '../types/types-interfaces';

@Component({
  selector: 'app-project-issues',
  templateUrl: './project-issues.component.html',
  styleUrls: ['./project-issues.component.css']
})
export class ProjectIssuesComponent implements OnInit {

  @Input()
  private project: Project;
  constructor() { }

  ngOnInit() {
  }

}
