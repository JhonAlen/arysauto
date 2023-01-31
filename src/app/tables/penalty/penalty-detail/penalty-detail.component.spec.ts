import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyDetailComponent } from './penalty-detail.component';

describe('PenaltyDetailComponent', () => {
  let component: PenaltyDetailComponent;
  let fixture: ComponentFixture<PenaltyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenaltyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenaltyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
