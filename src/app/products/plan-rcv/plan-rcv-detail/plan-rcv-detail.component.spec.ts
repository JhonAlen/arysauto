import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRcvDetailComponent } from './plan-rcv-detail.component';

describe('PlanRcvDetailComponent', () => {
  let component: PlanRcvDetailComponent;
  let fixture: ComponentFixture<PlanRcvDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanRcvDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanRcvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
