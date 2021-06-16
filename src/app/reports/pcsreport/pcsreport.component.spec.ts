import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcsreportComponent } from './pcsreport.component';

describe('PcsreportComponent', () => {
  let component: PcsreportComponent;
  let fixture: ComponentFixture<PcsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcsreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
