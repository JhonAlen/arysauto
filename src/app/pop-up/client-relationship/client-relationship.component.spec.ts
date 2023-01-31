import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRelationshipComponent } from './client-relationship.component';

describe('ClientRelationshipComponent', () => {
  let component: ClientRelationshipComponent;
  let fixture: ComponentFixture<ClientRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
