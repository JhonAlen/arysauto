import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCancellationsComponent } from './policy-cancellations.component';

describe('PolicyCancellationsComponent', () => {
  let component: PolicyCancellationsComponent;
  let fixture: ComponentFixture<PolicyCancellationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyCancellationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyCancellationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
