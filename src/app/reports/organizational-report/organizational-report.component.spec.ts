import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalReportComponent } from './organizational-report.component';

describe('OrganizationalReportComponent', () => {
  let component: OrganizationalReportComponent;
  let fixture: ComponentFixture<OrganizationalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
