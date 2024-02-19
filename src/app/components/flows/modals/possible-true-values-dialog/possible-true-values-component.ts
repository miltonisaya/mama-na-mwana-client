import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../../notifications/notifier.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CategoryService} from "../../category.service";
import {FlowService} from "../../flow.service";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'possible-true-values-component.html',
  styleUrls: ['possible-true-values-dialog.component.sass']
})

export class PossibleTrueValuesComponent implements OnInit {
  possibleValuesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PossibleTrueValuesComponent>,
    public notifierService: NotifierService,
    public categoryService: CategoryService,
    public flowService: FlowService,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.initializeFormGroup();
    console.log("Data received =>", this.data);
  }

  initializeFormGroup() {
    this.possibleValuesForm = this.formBuilder.group({
      possibleTrueValues: ['']
    });
  }

  savePossibleTrueValues() {
    let payload = {
      categoryId: this.data.possibleTrueValues.id,
      possibleTrueValues: this.possibleValuesForm.value.possibleTrueValues
    }

    this.categoryService.savePossibleValues(payload).subscribe((response: any) => {
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.flowService.getKeysByFlowId(this.data.flowId);
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      this.flowService.getKeysByFlowId(this.data.flowId);
      console.log("fetched keys by flow with id " + this.data.flowId);
    });
    this.matDialog.closeAll();
  }
}

