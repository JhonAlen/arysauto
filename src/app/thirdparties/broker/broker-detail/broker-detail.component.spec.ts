import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailComponent } from './broker-detail.component';

describe('BrokerDetailComponent', () => {
  let component: BrokerDetailComponent;
  let fixture: ComponentFixture<BrokerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
