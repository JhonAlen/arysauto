import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateDetailComponent } from './exchange-rate-detail.component';

describe('ExchangeRateDetailComponent', () => {
  let component: ExchangeRateDetailComponent;
  let fixture: ComponentFixture<ExchangeRateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeRateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
