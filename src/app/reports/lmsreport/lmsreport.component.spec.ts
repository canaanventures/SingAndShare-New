import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsreportComponent } from './lmsreport.component';

describe('LmsreportComponent', () => {
  let component: LmsreportComponent;
  let fixture: ComponentFixture<LmsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
