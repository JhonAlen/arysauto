import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyIndexComponent } from './penalty-index.component';

describe('PenaltyIndexComponent', () => {
  let component: PenaltyIndexComponent;
  let fixture: ComponentFixture<PenaltyIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenaltyIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenaltyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
