import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Viaje, Viajes } from '../interfaces/viajes';
import { StorageService } from './storage.service';
import { ViajeStatus } from '../enums/viaje-status';
import { AgendarStatus } from '../enums/agendar-status';
import { AuthService } from './auth.service';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  viajesData: Viajes = {
    viajes: new Map<string, Viaje>(),
    lastId: 0
  };
  constructor(private _storage: StorageService, private _auth: AuthService,
    private _db: DbService) { }

  async init() {
    const viajes = await this._db.get('viajes') as [];
    this.viajesData = { viajes: new Map(viajes.map((viaje) => [viaje['id'], viaje])), lastId: 0 };
  }

  async getFrom(user: Usuario) {
    await this.init();
    let viajes = [];
    this.viajesData.viajes.forEach(viaje => {
      if (viaje.conductor === user.correo) {
        viajes.push(viaje);
      }
    })
    return viajes;
    //* Probar el return de abajo
    //? [...this.viajesData.viajes.values()].filter(viaje => viaje.conductor.correo == user.correo)
  }

  async get() {
    await this.init();
    return this.viajesData;
  }

  async getViaje(id) {
    await this.init();
    return this.viajesData.viajes.get(id);
  }

  async scheduleViaje(viaje: {}) {
    let viajesUser = await this.getFrom(viaje['conductor']);
    viajesUser = viajesUser.filter(x => x.fecha == viaje['fecha']);
    if (viajesUser.length < 1) {
      let newViaje: Viaje = {
        id: -1,
        fecha: viaje['fecha'],
        destino: viaje['destino'],
        precio: viaje['precio'],
        capacidad: viaje['capacidad'],
        descripcion: viaje['descripcion'],
        conductor: viaje['conductor'],
        pasajeros: [],
        valoraciones: [],
        estatus: ViajeStatus.PENDING,
      }
      let added = await this._db.insertOne('Viajes', newViaje, true);
      await this.init();
      return added != null;
    }
    return false;
  }

  async cancelViaje(id, user: Usuario) {
    if (this.viajesData.viajes.has(id.toString())) {
      if (this.viajesData.viajes.get(id.toString()).conductor === user.correo) {
        //if (this.viajesData.viajes.get(id.toString()).pasajeros.length === 0) {
        if (this.viajesData.viajes.get(id.toString()).fecha.getTime() > new Date().getTime()) {
          let viajeACancelar = this.viajesData.viajes.get(id.toString());
          viajeACancelar.estatus = ViajeStatus.CANCELED;
          viajeACancelar.pasajeros.forEach(async (pasajero) => {
            let pasajeroObject = this._auth.getUser(pasajero) as Usuario;
            pasajeroObject.viaje = null;
            await this._auth.updateUser(user);
          })
          await this._db.updateOne('Viajes', ["id=" + viajeACancelar.id], viajeACancelar);
          await this.init();
          return true;
        }
      }
    }
    return false;
  }

  async editViaje(viaje: Viaje, user: Usuario) {
    if (viaje.conductor === user.correo) {
      await this._db.updateOne('Viajes', ["id=" + viaje.id], viaje);
      await this.init();
      return true;
    }
    return false;
  }

  async changeStatus(id, status: ViajeStatus) {
    if (this.viajesData.viajes.has(id.toString())) {
      let viaje = this.viajesData.viajes.get(id.toString())
      viaje.estatus = status;
      await this._db.updateOne('Viajes', ["id=" + viaje.id], viaje);
      this.init();
    }
  }

  async getRide(viaje, user: Usuario) {
    let viajeATomar = await this.getViaje(viaje);
    if (viajeATomar.capacidad - viajeATomar.pasajeros.length > 0) {
      if (viajeATomar.pasajeros.filter(pasajero => pasajero === user.correo).length === 0) {
        viajeATomar.pasajeros.push(user.correo);
        await this.syncDataToLocal(user);
        await this._db.updateOne('Viajes', ["id=" + viajeATomar.id], viajeATomar);
        user.viaje = viaje;
        await this._auth.updateUser(user)
        await this.init();
        return AgendarStatus.DONE;
      } else {
        return AgendarStatus.ALREADY_TAKEN;
      }
    }
    return AgendarStatus.NOT_ENOUGH_SPACE;
  }

  async cancelRide(id, user: Usuario) {
    if (this.viajesData.viajes.has(id)) {
      let viaje = this.viajesData.viajes.get(id);
      if (viaje.pasajeros.filter(pasajero => pasajero === user.correo).length > 0) {
        let viaje = this.viajesData.viajes.get(id);
        viaje.pasajeros = viaje.pasajeros.filter(pasajero => pasajero !== user.correo);
        await this._db.updateOne('Viajes', ["id=" + viaje.id], viaje);
        user.viaje = null;
        await this._auth.updateUser(user);
        await this.init();
        return true;
      }
    }
    return false;
  }

  //? Local data
  async syncDataToLocal(user: Usuario) {
    if (await this._storage.getData('viajes') == null) {
      this._storage.init('viajes', { viajesAgendados: new Map<string, Viaje>(), viajesProgramados: new Map<string, Viaje>() });
    }
    const viajes = [...this.viajesData.viajes.values()].filter(viaje => viaje.pasajeros.includes(user.correo));
    const viajesMap = new Map(viajes.map(viaje => [viaje.id, viaje]));
    // Viajes agendados
    const viajesProgramados = [...this.viajesData.viajes.values()].filter(viaje => viaje.conductor === user.correo);
    const viajesProgramadosMap = new Map(viajesProgramados.map(viaje => [viaje.id, viaje]));
    await this._storage.addData('viajes', { viajesAgendados: viajesMap, viajesProgramados: viajesProgramadosMap });
  }

  translateDate(date: Date) {
    let dia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][date.getDay()];
    let mes = ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()];
    let diaNum = date.getDate();
    let horas = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let minutos = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return `${dia} ${diaNum} de ${mes}. ${horas}:${minutos}`;
  }
}
