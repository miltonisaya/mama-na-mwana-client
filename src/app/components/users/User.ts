import {Role} from '../roles/role';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  username: string;
  roles: Role[];
}
