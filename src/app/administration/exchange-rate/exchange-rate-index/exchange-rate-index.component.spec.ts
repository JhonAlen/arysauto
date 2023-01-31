import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateIndexComponent } from './exchange-rate-index.component';

describe('ExchangeRateIndexComponent', () => {
  let component: ExchangeRateIndexComponent;
  let fixture: ComponentFixture<ExchangeRateIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeRateIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
