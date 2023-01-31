import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTypeIndexComponent } from './inspection-type-index.component';

describe('InspectionTypeIndexComponent', () => {
  let component: InspectionTypeIndexComponent;
  let fixture: ComponentFixture<InspectionTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
