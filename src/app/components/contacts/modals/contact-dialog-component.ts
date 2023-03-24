import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {ContactsService} from "../contacts.service";

@Component({
  selector: 'app-contact-dialog',
  templateUrl: 'contact-dialog-component.html',
  styleUrls: ['contact-dialog.component.sass']
})

export class ContactDialogComponent implements OnInit {
  constructor(
    public contactService: ContactsService,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    public notifierService: NotifierService
  ) {
  }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.contactService.form.get('id').value) {
      this.contactService.updateContact(this.contactService.form.value)
        .subscribe(response => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.onClose();
        }, error => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
        });
    }
  }

  onClose() {
    this.contactService.form.reset();
    this.contactService.initializeFormGroup();
    this.dialogRef.close();
  }
}
