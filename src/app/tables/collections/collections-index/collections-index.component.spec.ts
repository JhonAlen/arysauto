import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsIndexComponent } from './collections-index.component';

describe('CollectionsIndexComponent', () => {
  let component: CollectionsIndexComponent;
  let fixture: ComponentFixture<CollectionsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
