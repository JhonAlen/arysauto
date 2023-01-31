import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPenaltyComponent } from './client-penalty.component';

describe('ClientPenaltyComponent', () => {
  let component: ClientPenaltyComponent;
  let fixture: ComponentFixture<ClientPenaltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPenaltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
