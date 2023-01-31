import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandModelVersionDetailComponent } from './brand-model-version-detail.component';

describe('BrandModelVersionDetailComponent', () => {
  let component: BrandModelVersionDetailComponent;
  let fixture: ComponentFixture<BrandModelVersionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandModelVersionDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandModelVersionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
