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
  // Authority names the user holds via their role(s) — the same permission model
  // that gates API access and menu visibility on the backend; used here to gate
  // UI elements (buttons, sections) instead of a coarse super-admin flag.
  authorities: string[];
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    token: string;
    user: Omit<UserProfile, 'token' | 'menus' | 'authorities'>;
    menus: MenuItem[];
    authorities: string[];
  };
}
