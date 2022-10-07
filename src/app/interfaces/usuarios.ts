import { Viaje } from "./viajes";

export interface Usuarios {
    users: Map<string, {}>;
}

export interface Usuario {
    correo: string;
    contrasena: string;
    rut: string;
    nombre: string;
    patente: string;
    foto: string;
    viaje: Viaje | null;
    numero: number | null;
}
