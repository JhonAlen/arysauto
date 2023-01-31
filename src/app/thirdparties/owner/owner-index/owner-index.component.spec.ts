import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerIndexComponent } from './owner-index.component';

describe('OwnerIndexComponent', () => {
  let component: OwnerIndexComponent;
  let fixture: ComponentFixture<OwnerIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
