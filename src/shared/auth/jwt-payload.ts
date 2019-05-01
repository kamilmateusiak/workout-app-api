import { UserRole } from "src/entities/user/models/user-role.enum";

export interface JwtPayload {
   username: string;
   role: UserRole;
   iat?: Date;
}