import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGrouperBankComponent } from './client-grouper-bank.component';

describe('ClientGrouperBankComponent', () => {
  let component: ClientGrouperBankComponent;
  let fixture: ComponentFixture<ClientGrouperBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientGrouperBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientGrouperBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
