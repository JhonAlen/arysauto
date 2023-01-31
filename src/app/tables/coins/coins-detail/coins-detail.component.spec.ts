import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsDetailComponent } from './coins-detail.component';

describe('CoinsDetailComponent', () => {
  let component: CoinsDetailComponent;
  let fixture: ComponentFixture<CoinsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
