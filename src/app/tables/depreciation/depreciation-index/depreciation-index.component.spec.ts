import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationIndexComponent } from './depreciation-index.component';

describe('DepreciationIndexComponent', () => {
  let component: DepreciationIndexComponent;
  let fixture: ComponentFixture<DepreciationIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
