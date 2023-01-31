import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesIndexComponent } from './clauses-index.component';

describe('ClausesIndexComponent', () => {
  let component: ClausesIndexComponent;
  let fixture: ComponentFixture<ClausesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClausesIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClausesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
