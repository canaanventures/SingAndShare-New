import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalTreeComponent } from './organizational-tree.component';

describe('OrganizationalTreeComponent', () => {
  let component: OrganizationalTreeComponent;
  let fixture: ComponentFixture<OrganizationalTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationalTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
