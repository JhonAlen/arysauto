import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsIndexComponent } from './coins-index.component';

describe('CoinsIndexComponent', () => {
  let component: CoinsIndexComponent;
  let fixture: ComponentFixture<CoinsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
