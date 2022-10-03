import { Component } from '@angular/core';
import { Usuario } from './interfaces/usuario';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private _storage: StorageService) {

  }

  async ngOnInit() {
    // If using a custom driver:
    //await this.storage.defineDriver(MyCustomDriver)
    //await this._storage.create();
    this._storage.init();
  }
  
}
