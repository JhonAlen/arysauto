import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementTypeIndexComponent } from './replacement-type-index.component';

describe('ReplacementTypeIndexComponent', () => {
  let component: ReplacementTypeIndexComponent;
  let fixture: ComponentFixture<ReplacementTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
