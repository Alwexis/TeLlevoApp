import { Usuario } from "./usuario";

export interface Session {
    user: Usuario | null;
}
