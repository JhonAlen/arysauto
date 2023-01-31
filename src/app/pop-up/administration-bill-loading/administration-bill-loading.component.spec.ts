import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationBillLoadingComponent } from './administration-bill-loading.component';

describe('AdministrationBillLoadingComponent', () => {
  let component: AdministrationBillLoadingComponent;
  let fixture: ComponentFixture<AdministrationBillLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationBillLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationBillLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
