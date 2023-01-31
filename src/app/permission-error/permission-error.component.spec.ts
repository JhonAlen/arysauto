import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionErrorComponent } from './permission-error.component';

describe('PermissionErrorComponent', () => {
  let component: PermissionErrorComponent;
  let fixture: ComponentFixture<PermissionErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
