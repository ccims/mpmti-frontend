import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { CreateComponentDialogComponent } from './dialogs/create-component-dialog-demo/create-component-dialog.component';
import { CreateProjectDialogComponent } from './dialogs/create-project-dialog-demo/create-project-dialog.component';
import { ProjectInformationComponent } from './dashboard/overview/project-information/project-information.component';
import { GraphsModule } from './graphs/graphs.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';


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
        CreateComponentDialogComponent,
        CreateProjectDialogComponent,
        ProjectInformationComponent
    ],
    imports: [
        GraphsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule, ReactiveFormsModule,
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        GraphQLModule,
        HttpClientModule
    ],
    entryComponents: [CreateComponentDialogComponent, CreateProjectDialogComponent],
    providers: [
        ApiService, JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
