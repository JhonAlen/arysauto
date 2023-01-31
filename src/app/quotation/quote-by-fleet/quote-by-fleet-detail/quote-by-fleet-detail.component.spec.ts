import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteByFleetDetailComponent } from './quote-by-fleet-detail.component';

describe('QuoteByFleetDetailComponent', () => {
  let component: QuoteByFleetDetailComponent;
  let fixture: ComponentFixture<QuoteByFleetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteByFleetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteByFleetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
