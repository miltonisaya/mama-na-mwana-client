import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../components/auth/auth.service';
import {Router} from "@angular/router";
import {LoaderService} from "../../../components/loader/loader.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router,
    public loaderService: LoaderService
  ) {
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.toggleSideBarForMe.emit();
  }

  signOut() {
    this.authService.signOut();
  }

  profile() {
    this.router.navigate(["/profile"])
  }
}
