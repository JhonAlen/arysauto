import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementIndexComponent } from './replacement-index.component';

describe('ReplacementIndexComponent', () => {
  let component: ReplacementIndexComponent;
  let fixture: ComponentFixture<ReplacementIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
