import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationCauseComponent } from './cancellation-cause.component';

describe('CancellationCauseComponent', () => {
  let component: CancellationCauseComponent;
  let fixture: ComponentFixture<CancellationCauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationCauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationCauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
