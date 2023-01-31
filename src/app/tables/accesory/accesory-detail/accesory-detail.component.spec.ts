import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoryDetailComponent } from './accesory-detail.component';

describe('AccesoryDetailComponent', () => {
  let component: AccesoryDetailComponent;
  let fixture: ComponentFixture<AccesoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
