import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseDetailComponent } from './enterprise-detail.component';

describe('EnterpriseDetailComponent', () => {
  let component: EnterpriseDetailComponent;
  let fixture: ComponentFixture<EnterpriseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
