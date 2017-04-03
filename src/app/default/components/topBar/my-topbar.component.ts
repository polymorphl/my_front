import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { SharedService } from '../../services/shared.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'my-top-bar',
  templateUrl: './my-topbar.component.html',
  styleUrls: ['./my-topbar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Input() appName:string;
  private user: any; // make interface
  private _isSocketConnected: boolean;

  constructor(private auth: AuthService, private socket: SocketService,
              private shared: SharedService, private _language: LanguageService) {

  }

  ngOnInit() {
    this.shared.get('isLoggedIn').subscribe((loggedIn)=>{
      if(loggedIn){
        this.socket.getSocketStatusStream().subscribe((status)=>{
          this._isSocketConnected = status;
        });
      }
    });
  }

  handleLanguageState(state) {
    this._language.updateLanguage(state);
    // must .subscribe() to watch the observable
  }

  isAuth(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout().subscribe();
  }

}
