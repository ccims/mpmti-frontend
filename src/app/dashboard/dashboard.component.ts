import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  fillerNav = Array.from({ length: 5 }, (_, i) => `Navigation Item ${i + 1}`);
  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
