import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerIndexComponent } from './consumer-index.component';

describe('ConsumerIndexComponent', () => {
  let component: ConsumerIndexComponent;
  let fixture: ComponentFixture<ConsumerIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
