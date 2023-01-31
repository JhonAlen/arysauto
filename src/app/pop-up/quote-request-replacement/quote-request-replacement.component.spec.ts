import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteRequestReplacementComponent } from './quote-request-replacement.component';

describe('QuoteRequestReplacementComponent', () => {
  let component: QuoteRequestReplacementComponent;
  let fixture: ComponentFixture<QuoteRequestReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteRequestReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteRequestReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
