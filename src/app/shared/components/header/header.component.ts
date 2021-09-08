import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from '../../../modules/notifications/notifier.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  constructor(
    private router: Router,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
  }

  toggleSidebar(){
    this.toggleSideBarForMe.emit();
  }

  signOut() {
    localStorage.clear();
    this.notifierService.showNotification('Logged out successfully','OK','success');
    this.router.navigate(["/login"]);
  }
}
