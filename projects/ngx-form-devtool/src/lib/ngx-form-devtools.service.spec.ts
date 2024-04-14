import { TestBed } from '@angular/core/testing';

import { NgxFormDevtoolService } from './ngx-form-devtools.service';

describe('NgxFormDevtoolService', () => {
  let service: NgxFormDevtoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFormDevtoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
