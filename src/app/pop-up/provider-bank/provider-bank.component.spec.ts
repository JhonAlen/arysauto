import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderBankComponent } from './provider-bank.component';

describe('ProviderBankComponent', () => {
  let component: ProviderBankComponent;
  let fixture: ComponentFixture<ProviderBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
