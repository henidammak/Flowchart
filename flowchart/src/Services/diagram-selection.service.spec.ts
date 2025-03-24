import { TestBed } from '@angular/core/testing';

import { DiagramSelectionService } from './diagram-selection.service';

describe('DiagramSelectionService', () => {
  let service: DiagramSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
