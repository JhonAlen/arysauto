import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInsurerComponent } from './plan-insurer.component';

describe('PlanInsurerComponent', () => {
  let component: PlanInsurerComponent;
  let fixture: ComponentFixture<PlanInsurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanInsurerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanInsurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
