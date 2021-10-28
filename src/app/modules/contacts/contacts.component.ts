import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ContactsService} from './contacts.service';
import {NotifierService} from '../notifications/notifier.service';
import {Contact} from './Contact';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'facilityCode','urn', 'actions'];
  contacts: any = [];
  userId: string;
  dataSource: MatTableDataSource<Contact>;
  pageSize;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    return this.ContactsService.getContacts().subscribe((response: any) => {
      this.contacts = response.data;
      this.dataSource = new MatTableDataSource<Contact>(this.contacts.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
}
