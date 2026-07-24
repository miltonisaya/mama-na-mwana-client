import { Component, Input } from '@angular/core';
import { User } from '../../users/User';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
  standalone: false
})
export class ProfileInfoComponent {
  @Input() user: User | null = null;

  get roleNames(): string {
    const roles = this.user?.roles ?? [];
    return roles.length ? roles.map(r => r.name).join(', ') : 'System User';
  }

  get initials(): string {
    const name = this.user?.name ?? '';
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    return words.length === 1
      ? words[0].charAt(0).toUpperCase()
      : (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
}
