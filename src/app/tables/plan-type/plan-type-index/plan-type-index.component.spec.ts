import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTypeIndexComponent } from './plan-type-index.component';

describe('PlanTypeIndexComponent', () => {
  let component: PlanTypeIndexComponent;
  let fixture: ComponentFixture<PlanTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
