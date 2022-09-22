import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tus-viajes',
  templateUrl: './tus-viajes.page.html',
  styleUrls: ['./tus-viajes.page.scss'],
})
export class TusViajesPage implements OnInit {

  usuario;

  constructor(private router: Router, private activatedRouter: ActivatedRoute) {
    this.activatedRouter.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
      }
    })
  }

  ngOnInit() {
  }

  changePage(page) {
    let navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
      }
    }
    page == '/login' ? this.router.navigate([page]) : this.router.navigate([page], navigationExtras);
  }

}
