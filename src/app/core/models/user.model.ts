import { Role } from './role';
import { Status } from './status.model';

export class User {
  uid: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  role: Role;
}
