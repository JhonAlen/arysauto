import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessIndexComponent } from './process-index.component';

describe('ProcessIndexComponent', () => {
  let component: ProcessIndexComponent;
  let fixture: ComponentFixture<ProcessIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
