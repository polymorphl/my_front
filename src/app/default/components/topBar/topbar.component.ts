import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'my-top-bar',
  templateUrl: './topbar.component.html'
})
export class AppBarComponent implements OnInit {
  @Input() appName;
  private user: any;
  private _isSocketConnected: boolean;

  constructor(private auth: AuthService,
              private socket: SocketService,
              private shared: SharedService) {}
  ngOnInit() {
    this.shared.get('isLoggedIn').subscribe((loggedIn)=>{
      if(loggedIn){
        this.socket.getSocketStatusStream().subscribe((status)=>{
          this._isSocketConnected = status;
        });
      }
    });
  }

  isAuth(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout().subscribe(() => { console.info('Logout'); });
  }

}
