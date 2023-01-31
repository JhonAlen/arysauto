import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandIndexComponent } from './brand-index.component';

describe('BrandIndexComponent', () => {
  let component: BrandIndexComponent;
  let fixture: ComponentFixture<BrandIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
