import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTypeDetailComponent } from './plan-type-detail.component';

describe('PlanTypeDetailComponent', () => {
  let component: PlanTypeDetailComponent;
  let fixture: ComponentFixture<PlanTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
