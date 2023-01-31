import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageConceptIndexComponent } from './coverage-concept-index.component';

describe('CoverageConceptIndexComponent', () => {
  let component: CoverageConceptIndexComponent;
  let fixture: ComponentFixture<CoverageConceptIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverageConceptIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageConceptIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
