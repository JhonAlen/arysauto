import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatusComponent } from './general-status.component';

describe('GeneralStatusComponent', () => {
  let component: GeneralStatusComponent;
  let fixture: ComponentFixture<GeneralStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
