import { TestBed } from '@angular/core/testing';

import { SecurityConnectionService } from './security-connection.service';

describe('SecurityConnectionService', () => {
  let service: SecurityConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
