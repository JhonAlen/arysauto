import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBankComponent } from './client-bank.component';

describe('ClientBankComponent', () => {
  let component: ClientBankComponent;
  let fixture: ComponentFixture<ClientBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
