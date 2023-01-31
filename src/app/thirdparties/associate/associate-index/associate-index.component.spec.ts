import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateIndexComponent } from './associate-index.component';

describe('AssociateIndexComponent', () => {
  let component: AssociateIndexComponent;
  let fixture: ComponentFixture<AssociateIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
