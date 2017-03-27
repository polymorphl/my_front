import {Injectable} from '@angular/core'
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import {HttpService} from './http.service';
import {SharedService} from "./shared.service";
import {SocketService} from "./socket.service";
import {LanguageService} from "./language.service";
import {NotificationService} from "./notification.service";


@Injectable()
export class AuthService {

  private _generalData;

  constructor(private http: HttpService,
              private shared: SharedService,
              private router: Router,
              private language: LanguageService,
              private _ns: NotificationService,
              private socket: SocketService){ }

  authResolver(currentUser: any): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.connect((success) => {
        console.info('Socket connected');
        this.joinGeneralData();
        this.shared.setData('isLoggedIn', true);
        observer.next(currentUser);
      }, (error) => {
        this.shared.setData('isLoggedIn', false);
        this.shared.clearData('currentUser');
        observer.error(error);
      });
    });
    return observable;
  }

  login (user: any) {
    return this.http.post('/auth', {
      username: user.nickname,
      password: user.password
    }).flatMap((resp) => {
      localStorage.setItem('tkn', resp.headers.get('authorization'));
      this.shared.setData('currentUser', resp.data.payload);
      this.language.setLanguage(resp.data.payload.settings.language);
      this._ns.init();
      return this.authResolver(resp.data.payload);
    });
  }

  logout(): Observable<any>{
    return this.http.delete('/auth').flatMap((data) => {
      localStorage.removeItem('tkn');
      this.router.navigate(['/home']);
      this.shared.setData('isLoggedIn', false);
      this.shared.clearData('currentUser');
      this.socket.disconnect();
      return Observable.of({});
    });
  }

  register(data) { // TODO: client sanitazation and form error handling
    return this.http.post('/auth/register', data).flatMap((data) => {
      //apply anything relevant to successful register
      return Observable.of(data);
    })
  }

  checkNickname(data) {
    return this.http.post('/auth/checkNickname', data);
  }

  checkGamekey(data) {
    return this.http.post('/auth/checkGamekey', data);
  }

  recovery(data) {
    return this.http.post('/forgot', data);
  }

  reset(data) {
    return this.http.post('/forgot/change/', data);
  }

  joinGeneralData() {
    [this._generalData] = this.socket.join(['generalData']);
    this._generalData.subscribe(data => {
      this.shared.setData('currentUser', data);
      return Observable.of(data);
    });
  }

  pingAuth(){
    return this.http.get('/auth/ping').flatMap((resp) => {
      if(!resp.data.errors){
        this.shared.setData('currentUser', resp.data.payload);
        return this.authResolver(resp.data.payload);
      } else {
        console.info('[Auth] No token detected');
        return Observable.of(null);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.shared.getData('isLoggedIn');
  }
  isLoggedInAsync(): Observable<boolean> {
    return this.shared.get('isLoggedIn');
  }
}
