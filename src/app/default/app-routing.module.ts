import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent as HomePage } from './pages/home/home-page.component';

const appRoutes: Routes = [
  // Default
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  //{ path: 'register', component: RegisterPage },
  //{ path: 'recovery', component: ForgotPage },
  //{ path: 'reset/:token', component: ResetPage }
  // TODO move in lazy module
  //{ path: 'profile', component: AccountPage, canActivate: [ AuthGuard ] },
  //{ path: 'settings', component: SettingsPage, canActivate: [ AuthGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
