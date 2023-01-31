import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatusIndexComponent } from './general-status-index.component';

describe('GeneralStatusIndexComponent', () => {
  let component: GeneralStatusIndexComponent;
  let fixture: ComponentFixture<GeneralStatusIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralStatusIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralStatusIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
