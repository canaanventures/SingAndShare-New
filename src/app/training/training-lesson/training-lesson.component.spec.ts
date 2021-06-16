import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingLessonComponent } from './training-lesson.component';

describe('TrainingLessonComponent', () => {
  let component: TrainingLessonComponent;
  let fixture: ComponentFixture<TrainingLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingLessonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
