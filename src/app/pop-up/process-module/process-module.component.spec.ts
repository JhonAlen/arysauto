import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessModuleComponent } from './process-module.component';

describe('ProcessModuleComponent', () => {
  let component: ProcessModuleComponent;
  let fixture: ComponentFixture<ProcessModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
