import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Session } from 'protractor';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  session: Session = this._auth.getSession();

  constructor(private _router: Router, private _menu: MenuController,
    private _auth: AuthService) {
  }

  changePage(page) {
    this._menu.close('menu');
    page == '/login' ? this._router.navigate([page]) : this._router.navigate([page]);
  }

  verMenu() {
    this._menu.open('menu');
  }

  cerrarMenu() {
    this._menu.close('menu');
  }

}
