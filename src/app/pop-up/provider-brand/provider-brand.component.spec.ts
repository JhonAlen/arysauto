import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderBrandComponent } from './provider-brand.component';

describe('ProviderBrandComponent', () => {
  let component: ProviderBrandComponent;
  let fixture: ComponentFixture<ProviderBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
