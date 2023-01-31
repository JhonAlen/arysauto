import { TestBed } from '@angular/core/testing';

import { WebServiceConnectionService } from './web-service-connection.service';

describe('WebServiceConnectionService', () => {
  let service: WebServiceConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebServiceConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
