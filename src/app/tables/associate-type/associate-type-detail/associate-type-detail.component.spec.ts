import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateTypeDetailComponent } from './associate-type-detail.component';

describe('AssociateTypeDetailComponent', () => {
  let component: AssociateTypeDetailComponent;
  let fixture: ComponentFixture<AssociateTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
