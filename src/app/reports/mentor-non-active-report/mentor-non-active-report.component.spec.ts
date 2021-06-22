import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorNonActiveReportComponent } from './mentor-non-active-report.component';

describe('MentorNonActiveReportComponent', () => {
  let component: MentorNonActiveReportComponent;
  let fixture: ComponentFixture<MentorNonActiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorNonActiveReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorNonActiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
