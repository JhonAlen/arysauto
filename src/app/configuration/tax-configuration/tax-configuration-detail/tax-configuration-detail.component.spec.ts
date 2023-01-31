import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxConfigurationDetailComponent } from './tax-configuration-detail.component';

describe('TaxConfigurationDetailComponent', () => {
  let component: TaxConfigurationDetailComponent;
  let fixture: ComponentFixture<TaxConfigurationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxConfigurationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxConfigurationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
