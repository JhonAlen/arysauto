import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankIndexComponent } from './bank-index.component';

describe('BankIndexComponent', () => {
  let component: BankIndexComponent;
  let fixture: ComponentFixture<BankIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
