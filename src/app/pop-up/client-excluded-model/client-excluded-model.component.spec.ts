import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientExcludedModelComponent } from './client-excluded-model.component';

describe('ClientExcludedModelComponent', () => {
  let component: ClientExcludedModelComponent;
  let fixture: ComponentFixture<ClientExcludedModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientExcludedModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientExcludedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
