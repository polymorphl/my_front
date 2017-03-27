import {Injectable} from '@angular/core';
import { PushNotificationsService } from 'angular2-notifications';
import * as firebase from 'firebase';

import { HttpService } from './http.service';

@Injectable()
export class NotificationService {

  private _notificationTitle = 'My Front';
  public messaging:any;
  private _firebaseApp = null;
  private _firebase_token: string = 'firebase_token';

  constructor(private _push: PushNotificationsService,
              public http: HttpService) {}

  init() {
    // TODO app google
    const fbConf = {
      apiKey: "",
      authDomain: "",
      messagingSenderId: ""
    };

    if (this._firebaseApp === null) {
      this._firebaseApp = firebase.initializeApp(fbConf);
      this.messaging = firebase.messaging();

      this.messaging.onMessage((payload) => {
        this.fireNotification(payload);
      });
    }

  }

  fireNotification(payload) {
    this._push.create(this._notificationTitle, {
      body: payload.notification.body,
      icon: '/assets/icon.jpg'
    }).subscribe(
      res => {
        console.log(res);
    },
      err => console.log(err)
    )
  }

  requestPermissions() {
    this.messaging.requestPermission()
      .then(() => { this.resetUI(); })
      .catch(function (err) {
        console.log('Unable to get permission to notify.', err);
      });
  }

  setLocalToken(token) {
    window.localStorage.setItem(this._firebase_token, token);
  }

  getLocalToken() {
    return window.localStorage.getItem(this._firebase_token);
  }

  removeLocalToken() {
    window.localStorage.removeItem(this._firebase_token);
    window.localStorage.removeItem('sentToServer');
  }

  resetUI() {
    this.messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          this.sendTokenToServer(currentToken);
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
          // Show permission UI.
          this.setTokenSentToServer(false);
        }
      })
      .catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
        this.setTokenSentToServer(false);
      });
  }

  sendTokenToServer(token) {
    this.setLocalToken(token);
    if (!this.isTokenSentToServer()) {
      this.subscribeNewToken(token);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
    }
  }

  isTokenSentToServer() {
    if (window.localStorage.getItem('sentToServer') === "1") {
      return true;
    }
    return false;
  }

  setTokenSentToServer(sent) {
    if (sent) {
      window.localStorage.setItem('sentToServer', "1");
    } else {
      window.localStorage.setItem('sentToServer', "0");
    }
  }

  subscribeNewToken(token: string) {
    console.log('Sending token to server...');
    if (token.trim()) {
      let tmp = { token: token, userAgent: navigator.userAgent };
      return this.http.post('/notifications/subscribe', tmp).subscribe(
        (data) => { this.setTokenSentToServer(true); },
        (error) => { this.setTokenSentToServer(false); },
        () => { console.info('>> notification-process complete')})
    }
  }

  unsubscribeDevice() {
    let tmp = { token: this.getLocalToken() };
    return this.http.post('/notifications/unsubscribe', tmp).subscribe(
      (data) => {
        this.removeLocalToken();
        console.info('Notification should be disabled for this device');
      }
    );
  }

  testNotification() {
    let tmp = { token: this.getLocalToken() };
    return this.http.post('/notifications/test', tmp).subscribe(
      (data) => {},
      () => { console.info('>> notification-test complete')}
    );
  }

}
