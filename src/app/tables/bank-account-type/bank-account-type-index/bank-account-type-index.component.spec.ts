import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountTypeIndexComponent } from './bank-account-type-index.component';

describe('BankAccountTypeIndexComponent', () => {
  let component: BankAccountTypeIndexComponent;
  let fixture: ComponentFixture<BankAccountTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
