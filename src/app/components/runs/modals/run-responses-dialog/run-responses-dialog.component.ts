import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

interface ParsedResponseValue {
  key: string;
  name: string;
  value: string;
  category: string;
  time: string;
}

@Component({
    selector: 'app-run-responses-dialog',
    templateUrl: 'run-responses-dialog.component.html',
    styleUrls: ['run-responses-dialog.component.sass'],
    standalone: false
})
export class RunResponsesDialogComponent implements OnInit {
  responses: ParsedResponseValue[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { run: any }) {
  }

  ngOnInit(): void {
    this.responses = this.parseResponseValues(this.data?.run?.responseValues);
  }

  private parseResponseValues(raw: string): ParsedResponseValue[] {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).map(key => ({
        key,
        name: parsed[key]?.name ?? key,
        value: parsed[key]?.value ?? '',
        category: parsed[key]?.category ?? '',
        time: parsed[key]?.time ?? '',
      })).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    } catch {
      return [];
    }
  }
}
