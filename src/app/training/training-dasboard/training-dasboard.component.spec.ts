import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDasboardComponent } from './training-dasboard.component';

describe('TrainingDasboardComponent', () => {
  let component: TrainingDasboardComponent;
  let fixture: ComponentFixture<TrainingDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDasboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
