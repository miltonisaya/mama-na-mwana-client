import { Component, OnInit } from '@angular/core';
import { NotifierService } from '../notifications/notifier.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/User';

@Component({
  selector: 'app-users',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: false
})
export class PasswordResetComponent implements OnInit {
  user: User | null = null;
  activeTab: 'profile' | 'security' = 'profile';

  constructor(
    private notifierService: NotifierService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.findUserDetailsById();
  }

  findUserDetailsById() {
    const raw = localStorage.getItem('MNM_USER');
    const storedUser = raw ? JSON.parse(raw) : null;
    const userId = storedUser?.id;

    this.userService.findById({ id: userId }).subscribe((response) => {
      this.user = response.data;
    }, (error) => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }
}
