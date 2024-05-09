import { TestBed } from '@angular/core/testing';

import { TaskListManagerService } from './task-list-manager.service';

describe('TaskListManagerService', () => {
  let service: TaskListManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskListManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
