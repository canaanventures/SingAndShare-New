import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventreportComponent } from './eventreport.component';

describe('EventreportComponent', () => {
  let component: EventreportComponent;
  let fixture: ComponentFixture<EventreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
