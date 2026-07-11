import {Component, OnInit} from '@angular/core';
import {NotifierService} from '../notifications/notifier.service';
import {Dataset, DatasetsService} from './datasets.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {
  datasets: Dataset[] = [];
  selectedDataSetId: any = null;

  constructor(
    private datasetsService: DatasetsService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.fetchDatasets();
  }

  fetchDatasets(): void {
    this.datasetsService.getAllDatasets().subscribe({
      next: (response: any) => {
        console.log('datasets response:', response);
        // try both paginated and flat array shapes
        this.datasets = response?.data?.content
          ?? response?.data
          ?? response?.content
          ?? response
          ?? [];
      },
      error: (err) => {
        console.error('datasets error:', err);
        this.notifierService.showNotification(err?.error?.error ?? err?.message ?? 'Failed to load datasets', 'OK', 'error');
      }
    });
  }

  syncDatasets(): void {
    this.datasetsService.syncDatasets().subscribe({
      next: (response: any) => {
        this.notifierService.showNotification(response?.message ?? 'Sync complete', 'OK', 'success');
        this.fetchDatasets();
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? err?.message ?? 'Sync failed', 'OK', 'error');
      }
    });
  }

  onDatasetSelected(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedDataSetId = value || null;
  }
}
