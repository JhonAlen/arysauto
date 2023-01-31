import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraCoverageDetailComponent } from './extra-coverage-detail.component';

describe('ExtraCoverageDetailComponent', () => {
  let component: ExtraCoverageDetailComponent;
  let fixture: ComponentFixture<ExtraCoverageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraCoverageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraCoverageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
