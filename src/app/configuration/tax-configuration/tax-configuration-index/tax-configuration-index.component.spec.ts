import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxConfigurationIndexComponent } from './tax-configuration-index.component';

describe('TaxConfigurationIndexComponent', () => {
  let component: TaxConfigurationIndexComponent;
  let fixture: ComponentFixture<TaxConfigurationIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxConfigurationIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxConfigurationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
