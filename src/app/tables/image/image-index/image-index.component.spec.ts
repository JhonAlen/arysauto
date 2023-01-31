import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageIndexComponent } from './image-index.component';

describe('ImageIndexComponent', () => {
  let component: ImageIndexComponent;
  let fixture: ComponentFixture<ImageIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
