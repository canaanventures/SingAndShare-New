import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglegalleryComponent } from './singlegallery.component';

describe('SinglegalleryComponent', () => {
  let component: SinglegalleryComponent;
  let fixture: ComponentFixture<SinglegalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglegalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglegalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
