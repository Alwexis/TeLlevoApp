import { Viaje } from "./viaje";

export interface Usuario {
    correo: string;
    contrasena: string;
    rut: string;
    nombre: string;
    patente: string;
    foto: string;
    viaje: Viaje | null;
}
