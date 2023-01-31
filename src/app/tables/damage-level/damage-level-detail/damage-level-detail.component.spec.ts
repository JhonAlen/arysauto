import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageLevelDetailComponent } from './damage-level-detail.component';

describe('DamageLevelDetailComponent', () => {
  let component: DamageLevelDetailComponent;
  let fixture: ComponentFixture<DamageLevelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageLevelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageLevelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
