import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateTypeIndexComponent } from './associate-type-index.component';

describe('AssociateTypeIndexComponent', () => {
  let component: AssociateTypeIndexComponent;
  let fixture: ComponentFixture<AssociateTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
