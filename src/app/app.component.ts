import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ReportesService } from './services/reportes.service';
import { StorageService } from './services/storage.service';
import { ViajesService } from './services/viajes.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private _storage: StorageService, private _auth: AuthService,
    private _viajes: ViajesService, private _report: ReportesService) { }

  ngOnInit() {
    // If using a custom driver:
    //await this.storage.defineDriver(MyCustomDriver)
    //await this._storage.create();
    this.loadData();
  }

  async loadData() {
    await this._storage.init();
    this._auth.loadData();
    this._viajes.init();
    this._report.init();
  }
  
}
