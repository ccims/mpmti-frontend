import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account/account.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectIssuesComponent } from './project-issues/project-issues.component';
import { SystemArchitectureGraphComponent } from './system-architecture-graph/system-architecture-graph.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { ApiService } from './api/api.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    SettingsComponent,
    AccountComponent,
    ToolbarComponent,
    ProjectOverviewComponent,
    ProjectIssuesComponent,
    SystemArchitectureGraphComponent,
    IssueListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    ApiService, JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
