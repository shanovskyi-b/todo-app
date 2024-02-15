import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTaskGroupComponent } from './active-task-group.component';

describe('ActiveTaskGroupComponent', () => {
  let component: ActiveTaskGroupComponent;
  let fixture: ComponentFixture<ActiveTaskGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveTaskGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveTaskGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
