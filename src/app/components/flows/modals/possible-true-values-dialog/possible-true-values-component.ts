import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../../notifications/notifier.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'possible-true-values-component.html',
  styleUrls: ['possible-true-values-dialog.component.sass']
})

export class PossibleTrueValuesComponent implements OnInit {
  myForm: FormGroup;
  // possibleTrueValuesForm: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PossibleTrueValuesComponent>,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      possibleTrueValues: ['']
    });
  }

  savePossibleTrueValues() {
    console.log("Saving possible values ....")
  }
}

