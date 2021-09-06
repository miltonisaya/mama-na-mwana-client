import { Component, OnInit } from '@angular/core';
import { ObjectivesService } from '../objectives.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.sass']
})
export class RolesDialogComponent implements OnInit {
  constructor(
    private objectiveService: ObjectivesService,
    public dialogRef: MatDialogRef<RolesDialogComponent>
  ) { }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.objectiveService.form.valid) {
      if (this.objectiveService.form.get('id').value) {
        this.objectiveService.updateObjective(this.objectiveService.form.value)
          .subscribe(response => {
            this.onClose();
          });
      } else {
        this.objectiveService.createObjective(this.objectiveService.form.value)
          .subscribe(data => {
            this.onClose();
          });
      }
    }
  }
  onClose() {
    this.objectiveService.form.reset();
    this.objectiveService.initializeFormGroup();
    this.dialogRef.close();
  }
}
