import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateDetailComponent } from './associate-detail.component';

describe('AssociateDetailComponent', () => {
  let component: AssociateDetailComponent;
  let fixture: ComponentFixture<AssociateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
