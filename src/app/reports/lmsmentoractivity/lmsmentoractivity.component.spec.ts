import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsmentoractivityComponent } from './lmsmentoractivity.component';

describe('LmsmentoractivityComponent', () => {
  let component: LmsmentoractivityComponent;
  let fixture: ComponentFixture<LmsmentoractivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsmentoractivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsmentoractivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
