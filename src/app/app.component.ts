import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { ViajesService } from './services/viajes.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private _storage: StorageService, private _auth: AuthService,
    private _viajes: ViajesService) {
      
    }

  ngOnInit() {
    // If using a custom driver:
    //await this.storage.defineDriver(MyCustomDriver)
    //await this._storage.create();
    this.loadData();
  }

  async loadData() {
    await this._storage.init();
    await this._auth.loadData();
    await this._viajes.init();
  }
  
}
