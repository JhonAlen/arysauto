import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionTypeIndexComponent } from './transmission-type-index.component';

describe('TransmissionTypeIndexComponent', () => {
  let component: TransmissionTypeIndexComponent;
  let fixture: ComponentFixture<TransmissionTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmissionTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
