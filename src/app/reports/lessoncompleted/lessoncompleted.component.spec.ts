import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessoncompletedComponent } from './lessoncompleted.component';

describe('LessoncompletedComponent', () => {
  let component: LessoncompletedComponent;
  let fixture: ComponentFixture<LessoncompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessoncompletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessoncompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
