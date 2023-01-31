import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteByFleetIndexComponent } from './quote-by-fleet-index.component';

describe('QuoteByFleetIndexComponent', () => {
  let component: QuoteByFleetIndexComponent;
  let fixture: ComponentFixture<QuoteByFleetIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteByFleetIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteByFleetIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
