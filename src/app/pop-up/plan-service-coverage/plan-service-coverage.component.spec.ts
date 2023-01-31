import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanServiceCoverageComponent } from './plan-service-coverage.component';

describe('PlanServiceCoverageComponent', () => {
  let component: PlanServiceCoverageComponent;
  let fixture: ComponentFixture<PlanServiceCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanServiceCoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanServiceCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
