import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMentorsComponent } from './new-mentors.component';

describe('NewMentorsComponent', () => {
  let component: NewMentorsComponent;
  let fixture: ComponentFixture<NewMentorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMentorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMentorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
