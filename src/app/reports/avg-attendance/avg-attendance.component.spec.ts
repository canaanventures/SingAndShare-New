import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgAttendanceComponent } from './avg-attendance.component';

describe('AvgAttendanceComponent', () => {
  let component: AvgAttendanceComponent;
  let fixture: ComponentFixture<AvgAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
