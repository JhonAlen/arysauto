import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationCauseDetailComponent } from './cancellation-cause-detail.component';

describe('CancellationCauseDetailComponent', () => {
  let component: CancellationCauseDetailComponent;
  let fixture: ComponentFixture<CancellationCauseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationCauseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationCauseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
