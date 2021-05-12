import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeRegisterComponent } from './mentee-register.component';

describe('MenteeRegisterComponent', () => {
  let component: MenteeRegisterComponent;
  let fixture: ComponentFixture<MenteeRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenteeRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
