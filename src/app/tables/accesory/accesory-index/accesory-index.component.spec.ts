import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoryIndexComponent } from './accesory-index.component';

describe('AccesoryIndexComponent', () => {
  let component: AccesoryIndexComponent;
  let fixture: ComponentFixture<AccesoryIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesoryIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
