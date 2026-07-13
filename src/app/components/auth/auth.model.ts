export interface LoginCredentials {
  username: string;
  password: string;
}

export interface MenuItem {
  id: string;
  name: string;
  route: string;
  icon?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  token: string;
  menus: MenuItem[];
  isSuperAdministrator: boolean;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    token: string;
    user: Omit<UserProfile, 'token' | 'menus' | 'isSuperAdministrator'>;
    menus: MenuItem[];
    isSuperAdmin: boolean;
  };
}
