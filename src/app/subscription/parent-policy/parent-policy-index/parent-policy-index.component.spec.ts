import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentPolicyIndexComponent } from './parent-policy-index.component';

describe('ParentPolicyIndexComponent', () => {
  let component: ParentPolicyIndexComponent;
  let fixture: ComponentFixture<ParentPolicyIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentPolicyIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentPolicyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
