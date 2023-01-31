import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseForCancellationComponent } from './cause-for-cancellation.component';

describe('CauseForCancellationComponent', () => {
  let component: CauseForCancellationComponent;
  let fixture: ComponentFixture<CauseForCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauseForCancellationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CauseForCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
