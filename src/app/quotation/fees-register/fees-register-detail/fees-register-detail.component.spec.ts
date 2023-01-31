import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesRegisterDetailComponent } from './fees-register-detail.component';

describe('FeesRegisterDetailComponent', () => {
  let component: FeesRegisterDetailComponent;
  let fixture: ComponentFixture<FeesRegisterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesRegisterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesRegisterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
