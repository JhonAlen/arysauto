import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionTypeDetailComponent } from './transmission-type-detail.component';

describe('TransmissionTypeDetailComponent', () => {
  let component: TransmissionTypeDetailComponent;
  let fixture: ComponentFixture<TransmissionTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmissionTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
