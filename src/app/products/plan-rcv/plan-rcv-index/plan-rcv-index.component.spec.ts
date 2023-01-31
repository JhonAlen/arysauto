import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRcvIndexComponent } from './plan-rcv-index.component';

describe('PlanRcvIndexComponent', () => {
  let component: PlanRcvIndexComponent;
  let fixture: ComponentFixture<PlanRcvIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanRcvIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanRcvIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
