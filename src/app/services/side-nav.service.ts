import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  private sidenav: MatSidenav;

  constructor() { }

  public setSidenav(sidenav: MatSidenav): void {
      this.sidenav = sidenav;
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
}
