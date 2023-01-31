import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseIndexComponent } from './enterprise-index.component';

describe('EnterpriseIndexComponent', () => {
  let component: EnterpriseIndexComponent;
  let fixture: ComponentFixture<EnterpriseIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
