import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementTypeDetailComponent } from './replacement-type-detail.component';

describe('ReplacementTypeDetailComponent', () => {
  let component: ReplacementTypeDetailComponent;
  let fixture: ComponentFixture<ReplacementTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
