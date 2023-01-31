import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanServiceComponent } from './plan-service.component';

describe('PlanServiceComponent', () => {
  let component: PlanServiceComponent;
  let fixture: ComponentFixture<PlanServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
