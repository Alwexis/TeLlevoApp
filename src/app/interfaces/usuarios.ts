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
    viaje: number | null; // ID del viaje actual
    numero: number | null;
}
