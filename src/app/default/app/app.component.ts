import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public title = 'my_front works!';
  public appName = 'My_front';
  public minimalWidth = "900px"; // responsive css breakpoint
  public optionsToaster = {
    position: ["top", "right"],
    timeOut: 5000,
    lastOnBottom: true
  }
  private _opened: boolean = false;
  public _layout = 0;
  private _closeOnClickOutside: boolean = false;
  private _modeNum: number = 0;

  constructor(private _zone: NgZone) {
    this.enableResponsive();
  }

  ngOnInit() { }

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  private enableResponsive(): void {
    let mq = window.matchMedia(`screen and (min-width: ${this.minimalWidth})`);
    // init
    mq.matches ? this.desktopMode() : this.mobileMode();
    // listen for change
    mq.addListener((matchMedia) => {
      this._zone.run(() => { // force update
        matchMedia.matches ? this.desktopMode() : this.mobileMode();
      });
    });
  }

  private desktopMode(): void {
    this._openSidebar();
    this._modeNum = 1;
    this._closeOnClickOutside = false;
    this._layout = 0;
  }

  private mobileMode(): void {
    this._closeSidebar();
    this._modeNum = 0;
    this._closeOnClickOutside = true;
    this._layout = 1;
  }

  private _closeSidebar(): void {
    this._opened = false;
  }

  private _openSidebar(): void {
    this._opened = true;
  }
}
