import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilStatusIndexComponent } from './civil-status-index.component';

describe('CivilStatusIndexComponent', () => {
  let component: CivilStatusIndexComponent;
  let fixture: ComponentFixture<CivilStatusIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilStatusIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilStatusIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
