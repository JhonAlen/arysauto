import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDepreciationComponent } from './client-depreciation.component';

describe('ClientDepreciationComponent', () => {
  let component: ClientDepreciationComponent;
  let fixture: ComponentFixture<ClientDepreciationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDepreciationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDepreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
