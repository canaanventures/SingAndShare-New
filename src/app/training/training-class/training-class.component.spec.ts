import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingClassComponent } from './training-class.component';

describe('TrainingClassComponent', () => {
  let component: TrainingClassComponent;
  let fixture: ComponentFixture<TrainingClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
