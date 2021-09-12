import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../modules/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  toggleSidebar(){
    this.toggleSideBarForMe.emit();
  }

  signOut() {
    this.authService.signOut();
  }
}
