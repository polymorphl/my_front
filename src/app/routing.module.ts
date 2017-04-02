import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent as HomePage } from './default/pages/home/home-page.component';

const routes: Routes = [
  // Default
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  //{ path: 'register', component: RegisterPage },
  //{ path: 'recovery', component: ForgotPage },
  //{ path: 'reset/:token', component: ResetPage }
  { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' }
  // TODO move in lazy module
  //{ path: 'profile', component: AccountPage, canActivate: [ AuthGuard ] },
  //{ path: 'settings', component: SettingsPage, canActivate: [ AuthGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule { }
