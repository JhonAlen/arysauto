import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurerIndexComponent } from './insurer-index.component';

describe('InsurerIndexComponent', () => {
  let component: InsurerIndexComponent;
  let fixture: ComponentFixture<InsurerIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurerIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
