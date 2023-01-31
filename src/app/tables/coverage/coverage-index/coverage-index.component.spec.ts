import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageIndexComponent } from './coverage-index.component';

describe('CoverageIndexComponent', () => {
  let component: CoverageIndexComponent;
  let fixture: ComponentFixture<CoverageIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverageIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
