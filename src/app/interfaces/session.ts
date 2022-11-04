import { Usuario } from "./usuarios";

export interface Session {
    user: Usuario | null;
}
