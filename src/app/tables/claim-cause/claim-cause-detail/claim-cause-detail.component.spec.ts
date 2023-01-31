import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCauseDetailComponent } from './claim-cause-detail.component';

describe('ClaimCauseDetailComponent', () => {
  let component: ClaimCauseDetailComponent;
  let fixture: ComponentFixture<ClaimCauseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimCauseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimCauseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
