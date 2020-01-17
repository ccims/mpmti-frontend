import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../types/types-interfaces';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  @Input()
  private project: Project;

  constructor() {
  }

  ngOnInit() {
    console.log(`Issue List: current chosen project ${this.project.displayName}`);
  }

}
