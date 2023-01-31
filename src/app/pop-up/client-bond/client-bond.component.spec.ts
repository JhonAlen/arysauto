import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBondComponent } from './client-bond.component';

describe('ClientBondComponent', () => {
  let component: ClientBondComponent;
  let fixture: ComponentFixture<ClientBondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
