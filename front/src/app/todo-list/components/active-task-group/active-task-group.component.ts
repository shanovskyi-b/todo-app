import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskList } from '../../../shared/models/shared.models';
import { ApiService } from '../../../shared/api-service/api.service';

@Component({
  selector: 'app-active-task-group',
  templateUrl: './active-task-group.component.html',
  styleUrl: './active-task-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveTaskGroupComponent {
  @Input() taskList: TaskList | undefined;
  @Output() newTaskEvent = new EventEmitter<string>();

  constructor(public apiService: ApiService) {
  } 

  addNewItem(value: string) {
    this.newTaskEvent.emit(value);
  }
}
