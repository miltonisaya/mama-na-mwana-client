import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ContactsService} from './contacts.service';
import {NotifierService} from '../notifications/notifier.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DataElement} from "../data-elements/dataElement";
import {RolesDialogComponent} from "../roles/modals/roles-dialog-component";
import {ContactDialogComponent} from "./modals/contact-dialog-component";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'facilityCode','urn','actions'];
  contacts: any = [];
  userId: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  dataSource;
  private params: { pageNo: number; pageSize: number };

  constructor(
    private http: HttpClient,
    private ContactsService: ContactsService,
    private NotifierService: NotifierService,
    private DialogService: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getContacts();
  }

  /**
   * This method returns users
   */
  getContacts() {
    this.params = {
      "pageNo" : this.pageNo,
      "pageSize" : this.pageSize
    }

    return this.ContactsService.getContacts(this.params).subscribe((response: any) => {
      this.contacts = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.contacts.content);
    }, error => {
      this.NotifierService.showNotification(error.error.error,'OK', 'error');
    });
  }

  applyFilter(event: Event) {
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
        this.NotifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.NotifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.DialogService.closeAll();
  }

  registrationsByFacility() {
    this.ContactsService.registrationsByFacility()
      .subscribe( response => {
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
        this.NotifierService.showNotification(error.error.error,'OK', 'error');
      });
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
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
}
