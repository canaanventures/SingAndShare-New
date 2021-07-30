import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsmenteeactivityComponent } from './lmsmenteeactivity.component';

describe('LmsmenteeactivityComponent', () => {
  let component: LmsmenteeactivityComponent;
  let fixture: ComponentFixture<LmsmenteeactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsmenteeactivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsmenteeactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
