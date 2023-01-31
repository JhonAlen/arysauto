import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationCauseIndexComponent } from './cancellation-cause-index.component';

describe('CancellationCauseIndexComponent', () => {
  let component: CancellationCauseIndexComponent;
  let fixture: ComponentFixture<CancellationCauseIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationCauseIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationCauseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
