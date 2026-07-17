import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';
import { UserProfile } from '../../../components/auth/auth.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() linkActivated = new EventEmitter<void>();

  user: Partial<UserProfile> = {};
  menus: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  get userInitials(): string {
    const name = this.user?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  signOut(): void {
    this.authService.signOut();
  }

  private loadUser(): void {
    const raw = localStorage.getItem('MNM_USER');
    const parsed: UserProfile | null = raw ? JSON.parse(raw) : null;
    this.user = parsed ?? {};
    this.menus = parsed?.menus ?? [];
  }
}
