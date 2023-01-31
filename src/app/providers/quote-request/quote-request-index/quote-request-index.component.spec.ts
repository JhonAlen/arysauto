import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteRequestIndexComponent } from './quote-request-index.component';

describe('QuoteRequestIndexComponent', () => {
  let component: QuoteRequestIndexComponent;
  let fixture: ComponentFixture<QuoteRequestIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteRequestIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteRequestIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
