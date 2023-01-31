import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentPolicyDetailComponent } from './parent-policy-detail.component';

describe('ParentPolicyDetailComponent', () => {
  let component: ParentPolicyDetailComponent;
  let fixture: ComponentFixture<ParentPolicyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentPolicyDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentPolicyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
