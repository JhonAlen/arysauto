import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageConceptDetailComponent } from './coverage-concept-detail.component';

describe('CoverageConceptDetailComponent', () => {
  let component: CoverageConceptDetailComponent;
  let fixture: ComponentFixture<CoverageConceptDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverageConceptDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageConceptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
