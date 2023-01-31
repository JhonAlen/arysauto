import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerPermissionComponent } from './consumer-permission.component';

describe('ConsumerPermissionComponent', () => {
  let component: ConsumerPermissionComponent;
  let fixture: ComponentFixture<ConsumerPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
