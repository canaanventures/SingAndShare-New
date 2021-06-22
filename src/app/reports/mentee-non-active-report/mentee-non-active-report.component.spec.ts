import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeNonActiveReportComponent } from './mentee-non-active-report.component';

describe('MenteeNonActiveReportComponent', () => {
  let component: MenteeNonActiveReportComponent;
  let fixture: ComponentFixture<MenteeNonActiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenteeNonActiveReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeNonActiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
