import {Component, DestroyRef, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    standalone: false
})
export class DefaultComponent implements OnInit {

  sidebarIsOpen = true;
  sidebarMode: 'over' | 'side' = 'side';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private destroyRef: DestroyRef
  ) {
  }

  ngOnInit(): void {
    // Below 768px the drawer overlays content instead of pushing it, and starts
    // closed — mode="side" would otherwise permanently reserve its width and push
    // the main content off-screen on narrow viewports.
    this.breakpointObserver.observe('(max-width: 768px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({matches}) => {
        this.sidebarMode = matches ? 'over' : 'side';
        this.sidebarIsOpen = !matches;
      });
  }

  sideBarToggler($event: any) {
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.sidebarMode === 'over') {
      this.sidebarIsOpen = false;
    }
  }

}
