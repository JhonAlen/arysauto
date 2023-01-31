import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandModelVersionIndexComponent } from './brand-model-version-index.component';

describe('BrandModelVersionIndexComponent', () => {
  let component: BrandModelVersionIndexComponent;
  let fixture: ComponentFixture<BrandModelVersionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandModelVersionIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandModelVersionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
