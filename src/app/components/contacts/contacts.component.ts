import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ContactsService} from './contacts.service';
import {NotifierService} from '../notifications/notifier.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DataElement} from "../data-elements/dataElement";
import {ContactDialogComponent} from "./modals/contact-dialog-component";
import {userCan} from '../../helpers/user-can';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  displayedColumns: string[] = ["sno", 'name', 'facilityCode', 'urn', 'sex', 'age', 'actions'];
  contacts: any = [];
  userId: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  syncing = false;
  dataSource;

  constructor(
    private ContactsService: ContactsService,
    private NotifierService: NotifierService,
    private DialogService: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    const params = { pageNo: this.pageNo, pageSize: this.pageSize };
    return this.ContactsService.getContacts(params).subscribe((response: any) => {
      this.contacts = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.contacts?.content ?? []);
    }, error => {
      this.NotifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    if (!this.dataSource) return;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDeleteDialog(id) {
    this.userId = id;
    this.DialogService.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getContacts();
    });
  }

  delete() {
    this.ContactsService.delete(this.userId)
      .subscribe(response => {
        this.NotifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.NotifierService.showNotification(error.error.error, 'OK', 'error');
      });
    this.DialogService.closeAll();
  }

  registrationsByFacility() {
    this.ContactsService.registrationsByFacility()
      .subscribe(response => {
        const string = JSON.stringify(response);
        const result = JSON.parse(string);
        let base64String = result.data;

        const source = `data:application/pdf;base64,${base64String}`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `registrations-by-facility.pdf`
        link.click();
        // this.NotifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.NotifierService.showNotification(error.error.error, 'OK', 'error');
      });
  }

  get totalElements(): number { return this.contacts?.totalElements ?? 0; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; this.getContacts(); }
  prevPage()  { this.pageNo--; this.getContacts(); }
  nextPage()  { this.pageNo++; this.getContacts(); }
  lastPage()  { this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getContacts(); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getContacts();
  }

  openDialog(data?): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const contactData = {
        id: data.id,
        facilityCode: data.facilityCode
      };
      this.ContactsService.populateForm(contactData);
      this.DialogService.open(ContactDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getContacts();
      });
    } else {
      dialogConfig.data = {};
      this.DialogService.open(ContactDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getContacts();
      });
    }
  }

  syncContacts() {
    this.syncing = true;
    this.ContactsService.syncContacts().subscribe((response: any) => {
      this.syncing = false;
      this.getContacts();
      this.NotifierService.showNotification(response.message, 'OK', 'success');
    }, error => {
      this.syncing = false;
      this.NotifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }
}
