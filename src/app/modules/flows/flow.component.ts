import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotifierService} from '../notifications/notifier.service';
import {FlowService} from './flow.service';

@Component({
  selector: 'app-users',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit {
  flows: any = [];
  selectedFlowId: any = null;
  flowKeys: any = [];

  constructor(
    private FlowService: FlowService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getFlows();
  }

  /**
   * This method returns roles
   */
  getFlows() {
    let params = {
      pageSize : 1000
    };
    return this.FlowService.getFlows(params).subscribe((response: any) => {
      this.flows = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  syncFlows() {
    return this.FlowService.syncFlows().subscribe((response: any) => {
      this.getFlows();
      if(response.status == '200'){
        this.notifierService.showNotification(response.message,'OK','success');
      }
    }, error => {
      this.notifierService.showNotification(error,'OK','error');
      console.log(error);
    });
  }

  getKeys(event: any) {
    let id = event.value;
    return this.FlowService.getKeysByFlowId(id).subscribe((response: any) => {
      this.flowKeys = response.data;
      console.log(this.flowKeys);
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
    })
  }
}
