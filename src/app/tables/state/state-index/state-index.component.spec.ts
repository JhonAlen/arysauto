import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateIndexComponent } from './state-index.component';

describe('StateIndexComponent', () => {
  let component: StateIndexComponent;
  let fixture: ComponentFixture<StateIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
