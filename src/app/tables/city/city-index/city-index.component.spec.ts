import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityIndexComponent } from './city-index.component';

describe('CityIndexComponent', () => {
  let component: CityIndexComponent;
  let fixture: ComponentFixture<CityIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
