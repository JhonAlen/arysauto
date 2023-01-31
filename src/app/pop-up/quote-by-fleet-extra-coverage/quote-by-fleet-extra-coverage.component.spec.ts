import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteByFleetExtraCoverageComponent } from './quote-by-fleet-extra-coverage.component';

describe('QuoteByFleetExtraCoverageComponent', () => {
  let component: QuoteByFleetExtraCoverageComponent;
  let fixture: ComponentFixture<QuoteByFleetExtraCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteByFleetExtraCoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteByFleetExtraCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
