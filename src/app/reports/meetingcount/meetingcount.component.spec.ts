import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingcountComponent } from './meetingcount.component';

describe('MeetingcountComponent', () => {
  let component: MeetingcountComponent;
  let fixture: ComponentFixture<MeetingcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingcountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
