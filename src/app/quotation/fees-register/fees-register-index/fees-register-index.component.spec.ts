import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesRegisterIndexComponent } from './fees-register-index.component';

describe('FeesRegisterIndexComponent', () => {
  let component: FeesRegisterIndexComponent;
  let fixture: ComponentFixture<FeesRegisterIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesRegisterIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesRegisterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
