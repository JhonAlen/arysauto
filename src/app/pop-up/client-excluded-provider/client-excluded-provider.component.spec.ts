import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientExcludedProviderComponent } from './client-excluded-provider.component';

describe('ClientExcludedProviderComponent', () => {
  let component: ClientExcludedProviderComponent;
  let fixture: ComponentFixture<ClientExcludedProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientExcludedProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientExcludedProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
