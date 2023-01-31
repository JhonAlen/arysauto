import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCauseIndexComponent } from './claim-cause-index.component';

describe('ClaimCauseIndexComponent', () => {
  let component: ClaimCauseIndexComponent;
  let fixture: ComponentFixture<ClaimCauseIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimCauseIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimCauseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
