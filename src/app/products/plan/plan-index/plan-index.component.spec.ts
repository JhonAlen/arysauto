import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanIndexComponent } from './plan-index.component';

describe('PlanIndexComponent', () => {
  let component: PlanIndexComponent;
  let fixture: ComponentFixture<PlanIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
