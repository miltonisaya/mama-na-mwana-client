import { ComponentFixture, TestBed } from '@angular/core/testing';
import {OrganisationUnitComponent} from './organisation-unit.component';


describe('OrganisationUnitComponent', () => {
  let component: OrganisationUnitComponent;
  let fixture: ComponentFixture<OrganisationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
