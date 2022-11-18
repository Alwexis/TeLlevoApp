import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Viaje, Viajes } from '../interfaces/viajes';
import { StorageService } from './storage.service';
import { ViajeStatus } from '../enums/viaje-status';
import { AgendarStatus } from '../enums/agendar-status';
import { AuthService } from './auth.service';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  viajesData: Viajes = {
    viajes: new Map<string, Viaje>(),
    lastId: 0
  };

  intervalo = interval(60000);
  suscripcion = this.intervalo.subscribe(() => {
    this.viajesData.viajes.forEach(viaje => {
      let fecha = new Date(viaje.fecha).getTime();
      let fechaActual = new Date().getTime();
      if (fecha < fechaActual && viaje.estatus != ViajeStatus.CANCELED) { this.changeStatus(viaje.id, ViajeStatus.COMPLETED); }
    })
  });

  constructor(private _storage: StorageService, private _auth: AuthService) { }

  async init() {
    this.viajesData = await this._storage.getData('viajes');
    if (this.viajesData == undefined || this.viajesData == null) {
      this.viajesData = await this._storage.addData('viajes', { viajes: new Map<string, Viaje>(), lastId: 0 });
    }
    return this.viajesData
  }

  getFrom(user: Usuario) {
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

  get() {
    return this.viajesData;
  }

  getViaje(id) {
    return this.viajesData.viajes.get(id.toString());
  }

  async scheduleViaje(viaje: {}) {
    let viajesUser = this.getFrom(viaje['conductor']).filter(x => x.fecha == viaje['fecha']);
    if (viajesUser.length < 1) {
      this.viajesData.lastId++;
      let newViaje: Viaje = {
        id: this.viajesData.lastId,
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
      this.viajesData.viajes.set(this.viajesData.lastId.toString(), newViaje);
      let added = await this._storage.addData('viajes', this.viajesData);
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
          await this._storage.addData('viajes', this.viajesData);
          return true;
        }
      }
    }
    return false;
  }

  async editViaje(viaje: Viaje, user: Usuario) {
    if (viaje.conductor === user.correo) {
      this.viajesData.viajes.set(viaje.id.toString(), viaje);
      await this._storage.addData('viajes', this.viajesData);
      return true;
    }
    return false;
  }

  changeStatus(id, status: ViajeStatus) {
    if (this.viajesData.viajes.has(id.toString())) {
      this.viajesData.viajes.get(id.toString()).estatus = status;
      this._storage.addData('viajes', this.viajesData);
    }
  }

  async getRide(viaje, user: Usuario) {
    if (this.viajesData.viajes.get(viaje.toString()).capacidad - this.viajesData.viajes.get(viaje.toString()).pasajeros.length > 0) {
      if (this.viajesData.viajes.get(viaje.toString()).pasajeros.filter(pasajero => pasajero === user.correo).length === 0) {
        this.viajesData.viajes.get(viaje.toString()).pasajeros.push(user.correo);
        await this._storage.addData('viajes', this.viajesData);
        user.viaje = viaje;
        await this._auth.updateUser(user)
        return AgendarStatus.DONE;
      } else {
        return AgendarStatus.ALREADY_TAKEN;
      }
    }
    return AgendarStatus.NOT_ENOUGH_SPACE;
  }

  async cancelRide(id, user: Usuario) {
    if (this.viajesData.viajes.has(id.toString())) {
      let viaje = this.viajesData.viajes.get(id.toString());
      if (viaje.pasajeros.filter(pasajero => pasajero === user.correo).length > 0) {
        this.viajesData.viajes.get(id.toString()).pasajeros = viaje.pasajeros.filter(pasajero => pasajero !== user.correo);
        await this._storage.addData('viajes', this.viajesData);
        user.viaje = null;
        await this._auth.updateUser(user)
        return true;
      }
    }
    return false;
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
