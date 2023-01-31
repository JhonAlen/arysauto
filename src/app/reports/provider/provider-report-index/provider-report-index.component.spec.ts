import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderReportIndexComponent } from './provider-report-index.component';

describe('ProviderReportIndexComponent', () => {
  let component: ProviderReportIndexComponent;
  let fixture: ComponentFixture<ProviderReportIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderReportIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderReportIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
