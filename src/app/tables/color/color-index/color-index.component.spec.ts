import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorIndexComponent } from './color-index.component';

describe('ColorIndexComponent', () => {
  let component: ColorIndexComponent;
  let fixture: ComponentFixture<ColorIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
