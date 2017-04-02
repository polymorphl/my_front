import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';

import { AuthService } from "../services/auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
   return this.loggedInOrRedirect();
  }


  canActivate(): Observable<boolean> {
    return this.loggedInOrRedirect();
  }

  loggedInOrRedirect(): Observable<boolean> {
    return this.auth.isLoggedInAsync().map((data)=>{
      if(data){
        return true;
      }
      else {
        console.warn('[Auth Guard]: cannot access ressource');
        this.router.navigate(['/home']);
        return false;
      }
    }).catch(()=>{
      return Observable.of(false);
    })
  }
}
