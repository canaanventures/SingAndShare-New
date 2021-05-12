import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelieveComponent } from './believe.component';

describe('BelieveComponent', () => {
  let component: BelieveComponent;
  let fixture: ComponentFixture<BelieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BelieveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BelieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
