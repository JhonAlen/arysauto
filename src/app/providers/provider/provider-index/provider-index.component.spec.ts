import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderIndexComponent } from './provider-index.component';

describe('ProviderIndexComponent', () => {
  let component: ProviderIndexComponent;
  let fixture: ComponentFixture<ProviderIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
