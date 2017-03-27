import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { AuthGuard } from './auth/auth.module';
//import { HomePage, AccountPage, ForgotPage, RegisterPage, ResetPage, SettingsPage } from './pages';

let AuthGuard = true;

/*const appRoutes: Routes = [
  // Default
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'profile', component: AccountPage, canActivate: [ AuthGuard ] },
  { path: 'settings', component: SettingsPage, canActivate: [ AuthGuard ] },
  //Authentification part
  { path: 'register', component: RegisterPage },
  { path: 'recovery', component: ForgotPage },
  { path: 'reset/:token', component: ResetPage },
  // Lazy modules
  { path: 'map', loadChildren: './_lazy/map/map.lazy.module#MapLazyModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
*/
export class AppRoutingModule { }
