import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account/account.component';
import { LoginGuard } from './auth/login.guard';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard] },
    { path: 'register', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'settings', component: SettingsComponent, canActivate: [LoginGuard] },
    { path: 'account', component: AccountComponent, canActivate: [LoginGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
