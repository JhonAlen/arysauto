import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageDetailComponent } from './coverage-detail.component';

describe('CoverageDetailComponent', () => {
  let component: CoverageDetailComponent;
  let fixture: ComponentFixture<CoverageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
