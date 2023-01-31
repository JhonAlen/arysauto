import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerIndexComponent } from './broker-index.component';

describe('BrokerIndexComponent', () => {
  let component: BrokerIndexComponent;
  let fixture: ComponentFixture<BrokerIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
