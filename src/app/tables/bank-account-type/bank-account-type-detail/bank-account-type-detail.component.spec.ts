import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountTypeDetailComponent } from './bank-account-type-detail.component';

describe('BankAccountTypeDetailComponent', () => {
  let component: BankAccountTypeDetailComponent;
  let fixture: ComponentFixture<BankAccountTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
