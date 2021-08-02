import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonscompletedComponent } from './lessonscompleted.component';

describe('LessonscompletedComponent', () => {
  let component: LessonscompletedComponent;
  let fixture: ComponentFixture<LessonscompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonscompletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonscompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
