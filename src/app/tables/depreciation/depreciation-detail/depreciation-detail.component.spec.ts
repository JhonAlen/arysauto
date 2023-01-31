import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationDetailComponent } from './depreciation-detail.component';

describe('DepreciationDetailComponent', () => {
  let component: DepreciationDetailComponent;
  let fixture: ComponentFixture<DepreciationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
