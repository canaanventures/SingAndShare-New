import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicreportComponent } from './topicreport.component';

describe('TopicreportComponent', () => {
  let component: TopicreportComponent;
  let fixture: ComponentFixture<TopicreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
