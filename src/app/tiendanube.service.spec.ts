import { TestBed } from '@angular/core/testing';

import { TiendanubeService } from './tiendanube.service';

describe('TiendanubeService', () => {
  let service: TiendanubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiendanubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
