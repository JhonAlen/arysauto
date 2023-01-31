import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssociateComponent } from './client-associate.component';

describe('ClientAssociateComponent', () => {
  let component: ClientAssociateComponent;
  let fixture: ComponentFixture<ClientAssociateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAssociateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssociateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
