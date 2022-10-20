import { Injectable } from '@angular/core';
import { Reportes, Reporte } from '../interfaces/reporte';
import { Usuario } from '../interfaces/usuarios';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  reportes: Reportes = {
    lastId: 0,
    reportes: []
  }

  constructor(private _storage: StorageService) { }

  async init() {
    this.reportes = await this._storage.getData('reportes');
    if (this.reportes === null) {
      this.reportes = await this._storage.addData('reportes', { lastId: 0, reportes: [] });
    }
    return this.reportes;
  }

  async reportUser(usuario: Usuario, reportado: Usuario, reporte: { motivo: string, descripcion: string }) {
    this.reportes.lastId++;
    let nuevoReporte: Reporte = {
      id: this.reportes.lastId,
      motivo: reporte.motivo,
      descripcion: reporte.descripcion,
      usuarioReportado: reportado.correo,
      usuario: usuario.correo,
      fecha: new Date().toISOString()
    }
    this.reportes.reportes.push(nuevoReporte);
    await this._storage.addData('reportes', this.reportes);
  }

  getReportes(query?: { usuarioReportado?: string, usuario?: string }) {
    if (query) {
      let reportes = [];
      for (let key in query) {
        reportes.push(this.reportes.reportes.find(reporte => reporte[key] != null));
      }
      return reportes;
    }
    return this.reportes.reportes;
  }

  getReporte(id: number) {
    return this.reportes.reportes.find(r => r.id === id);
  }
}
