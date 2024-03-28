import { TestBed } from '@angular/core/testing';

import { NavsettingService } from './navsetting.service';

describe('NavsettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavsettingService = TestBed.get(NavsettingService);
    expect(service).toBeTruthy();
  });
});
