import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBrokerComponent } from './client-broker.component';

describe('ClientBrokerComponent', () => {
  let component: ClientBrokerComponent;
  let fixture: ComponentFixture<ClientBrokerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBrokerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
