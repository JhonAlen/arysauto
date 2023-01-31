import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLoadingComponent } from './bill-loading.component';

describe('BillLoadingComponent', () => {
  let component: BillLoadingComponent;
  let fixture: ComponentFixture<BillLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
