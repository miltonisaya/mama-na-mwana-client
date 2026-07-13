import {ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';
import {OrganisationUnitService} from './organisation-unit.service';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

interface OuNode {
  id: string;
  name: string;
  code: string;
  otherNames: string | null;
  parentId: string | null;
  children?: OuNode[];
  hasChildren: boolean;
  matched?: boolean;
}

// Shape returned by the /search-tree endpoint: each match nests its ancestor chain via `parent`
interface OuSearchResult {
  id: string;
  name: string;
  code: string;
  otherNames: string | null;
  parentId: string | null;
  hasChildren: boolean;
  parent?: OuSearchResult;
}

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-organisation-units',
  templateUrl: './organisation-unit.component.html',
  styleUrls: ['./organisation-unit.component.scss'],
})
export class OrganisationUnitComponent implements OnInit, OnDestroy {
  treeControl = new NestedTreeControl<OuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OuNode>();
  selectedNode: OuNode | null = null;

  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  organisationUnitId: string;
  isSuperAdministrator: boolean = false;

  searchQuery = '';
  isSearching = false;
  isSearchMode = false;
  noResultsFound = false;
  private readonly searchTerm$ = new Subject<string>();

  constructor(
    private organisationUnitService: OrganisationUnitService,
    private dialog: MatDialog,
    private notifierService: NotifierService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getRootOrganisationUnits();
    this.checkIsAdmin();

    this.searchTerm$
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap(term => {
          this.isSearching = true;
          return this.organisationUnitService.searchTree(term);
        })
      )
      .subscribe(
        (results: OuSearchResult[]) => {
          this.isSearching = false;
          if (!this.isSearchMode) {
            // search was cleared while the request was in flight — discard the stale response
            return;
          }
          this.renderSearchResults(results || []);
        },
        error => {
          this.isSearching = false;
          this.notifierService.showNotification(error.error?.error, 'OK', 'error');
        }
      );
  }

  ngOnDestroy(): void {
    this.searchTerm$.complete();
  }

  checkIsAdmin() {
    const mnmUser = JSON.parse(localStorage.getItem('MNM_USER') || '{}');
    this.isSuperAdministrator = !!mnmUser.isSuperAdministrator;
  }

  getRootOrganisationUnits() {
    this.organisationUnitService.getRootOrganisationUnits().subscribe(
      (response: OuNode[]) => {
        console.log('Root nodes loaded:', response);
        this.dataSource.data = response;
        this.treeControl.dataNodes = response; // Sync tree control
        this.cdr.detectChanges();
      },
      error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
        console.error('Error fetching root nodes:', error);
      }
    );
  }

  loadChildren(node: OuNode) {
    if (!node.children && node.hasChildren) {
      console.log('Fetching children for:', node.id, node.name);
      this.organisationUnitService.getChildren(node.id).subscribe(
        (response: OuNode[]) => {
          console.log('Children loaded for', node.name, ':', response);
          node.children = response; // Assign children to the node

          // Manual refresh: Reset and reassign dataSource.data to force re-render
          const currentData = this.dataSource.data;
          this.dataSource.data = []; // Clear the data source
          this.dataSource.data = currentData; // Reassign the updated data
          this.treeControl.dataNodes = this.dataSource.data; // Sync tree control
          this.treeControl.expand(node); // Ensure node stays expanded
          this.cdr.detectChanges(); // Force change detection

          console.log('Updated dataSource.data after refresh:', this.dataSource.data);
        },
        error => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
          console.error('Error fetching children:', error);
        }
      );
    } else {
      console.log('No fetch needed for', node.name, '- already loaded or no children');
    }
  }

  onNodeExpand(node: OuNode) {
    if (!this.treeControl.isExpanded(node)) {
      console.log('Expanding node:', node.name);
      this.treeControl.expand(node);
      this.loadChildren(node);
    } else {
      console.log('Collapsing node:', node.name);
      this.treeControl.collapse(node);
      this.cdr.detectChanges();
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery = value;
    const trimmed = value.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      this.exitSearchMode();
      return;
    }

    this.isSearchMode = true;
    this.noResultsFound = false;
    this.searchTerm$.next(trimmed);
  }

  clearSearch() {
    this.searchQuery = '';
    this.exitSearchMode();
  }

  private exitSearchMode() {
    if (!this.isSearchMode) {
      return;
    }
    this.isSearchMode = false;
    this.isSearching = false;
    this.noResultsFound = false;
    this.getRootOrganisationUnits();
  }

  private renderSearchResults(results: OuSearchResult[]) {
    this.noResultsFound = results.length === 0;
    const forest = this.buildSearchForest(results);
    this.dataSource.data = forest;
    this.treeControl.dataNodes = forest;
    this.expandAll(forest);
    this.cdr.detectChanges();
  }

  // Merges each match with its ancestor chain (dto.parent, dto.parent.parent, ...) into a
  // deduplicated tree so multiple matches under the same branch share ancestor nodes.
  private buildSearchForest(results: OuSearchResult[]): OuNode[] {
    const nodesById = new Map<string, OuNode>();
    const roots: OuNode[] = [];

    const toNode = (dto: OuSearchResult, matched: boolean): OuNode => {
      let node = nodesById.get(dto.id);
      if (!node) {
        node = {
          id: dto.id,
          name: dto.name,
          code: dto.code,
          otherNames: dto.otherNames,
          parentId: dto.parentId,
          hasChildren: dto.hasChildren,
          matched
        };
        nodesById.set(dto.id, node);
      } else if (matched) {
        node.matched = true;
      }
      return node;
    };

    for (const result of results) {
      let childNode = toNode(result, true);
      let currentDto = result;

      while (currentDto.parent) {
        const parentNode = toNode(currentDto.parent, false);
        parentNode.hasChildren = true;
        parentNode.children = parentNode.children || [];
        if (!parentNode.children.some(c => c.id === childNode.id)) {
          parentNode.children.push(childNode);
        }
        childNode = parentNode;
        currentDto = currentDto.parent;
      }

      if (!roots.some(r => r.id === childNode.id)) {
        roots.push(childNode);
      }
    }

    return roots;
  }

  private expandAll(nodes: OuNode[]) {
    for (const node of nodes) {
      if (node.children && node.children.length) {
        this.treeControl.expand(node);
        this.expandAll(node.children);
      }
    }
  }

  // Re-runs whichever view is currently active, so editing/deleting a search result
  // doesn't kick the user back out to the unfiltered root tree.
  private refreshTree() {
    const trimmed = this.searchQuery.trim();
    if (this.isSearchMode && trimmed.length >= MIN_SEARCH_LENGTH) {
      this.searchTerm$.next(trimmed);
    } else {
      this.getRootOrganisationUnits();
    }
  }

  openDialog(data?: OuNode): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (data) {
      const ouData = {id: data.id, name: data.name, code: data.code, parentId: data.parentId};
      this.organisationUnitService.populateForm(ouData);
      this.dialog
        .open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.refreshTree();
        });
    } else {
      dialogConfig.data = {};
      this.dialog
        .open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.refreshTree();
        });
    }
  }

  openDeleteDialog(id: string) {
    this.organisationUnitId = id;
    this.dialog
      .open(this.deleteDialog)
      .afterClosed()
      .subscribe(() => {
        this.refreshTree();
      });
  }

  delete() {
    this.organisationUnitService.delete(this.organisationUnitId).subscribe(
      response => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.refreshTree();
      },
      error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      }
    );
    this.dialog.closeAll();
  }

  hasNestedChild = (_: number, node: OuNode) => {
    const result = node.hasChildren;
    console.log('Checking if', node.name, 'has children:', result);
    return result;
  };

  onNodeClick(node: OuNode) {
    this.selectedNode = node;
    console.log('Node clicked:', node.name);
  }
}
