import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ContactsService} from './contacts.service';
import {NotifierService} from '../notifications/notifier.service';
import {Contact} from './Contact';
import {MatDialog} from '@angular/material/dialog';
import {DataElement} from "../data-elements/dataElement";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'facilityCode','urn'];
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
      this.contacts = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.contacts.content);
    }, error => {
      this.NotifierService.showNotification(error.message,'OK','error');
      console.log(error);
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
        this.NotifierService.showNotification(error.message,'OK','error')
      });
    this.DialogService.closeAll();
  }

  syncContacts() {
    this.ContactsService.syncContacts()
      .subscribe( response => {
        console.log("Sync response =>",response);
        // this.NotifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.NotifierService.showNotification(error.message, 'OK', 'error');
      });
  }

  pageChanged(e: any) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getContacts();
  }
}