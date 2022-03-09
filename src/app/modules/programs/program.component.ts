import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';
import {Program} from './program';
import {ProgramService} from './program.service';

@Component({
  selector: 'app-programs',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'code','dhis2uid'];
  programs: any = [];
  dataSource: MatTableDataSource<Program>;
  pageSize;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ProgramService: ProgramService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getPrograms();
  }

  /**
   * This method returns data elements
   */
  getPrograms() {
    return this.ProgramService.getDataElements().subscribe((response: any) => {
      this.programs = response.data;
      this.dataSource = new MatTableDataSource<Program>(this.programs.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncPrograms(){
    return this.ProgramService.syncPrograms().subscribe((response: any) => {
      console.log(response);
      this.getPrograms();
      if(response.status == '200'){
        console.log("The message===>",response);
        this.notifierService.showNotification(response.message,'OK','success');
      }
    }, error => {
      // console.log("The error===>",error.message);
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });  }
}
