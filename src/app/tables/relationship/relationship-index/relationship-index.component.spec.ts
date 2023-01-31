import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipIndexComponent } from './relationship-index.component';

describe('RelationshipIndexComponent', () => {
  let component: RelationshipIndexComponent;
  let fixture: ComponentFixture<RelationshipIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
