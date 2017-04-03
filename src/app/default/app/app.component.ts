import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public title = 'my_front works!';
  public appName = 'My_front';
  public optionsToaster = {
    position: ["top", "right"],
    timeOut: 5000,
    lastOnBottom: true
  }
  private _opened: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  constructor() { }

  ngOnInit() { }
}
