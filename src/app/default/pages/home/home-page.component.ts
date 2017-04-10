import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'my-home-page',
  templateUrl: 'home-page.component.html'
})

export class HomePageComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }

  handleState(data:any) {
    console.log(data);
  }

  navigateToForgot() {
    this.router.navigate(['/forgot']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
