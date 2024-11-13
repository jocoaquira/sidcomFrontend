/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Permission.helperService } from './permission.helper.service';

describe('Service: Permission.helper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Permission.helperService]
    });
  });

  it('should ...', inject([Permission.helperService], (service: Permission.helperService) => {
    expect(service).toBeTruthy();
  }));
});
