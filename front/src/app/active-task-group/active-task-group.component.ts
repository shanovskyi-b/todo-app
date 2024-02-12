import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskList } from '../shared/models/shared.models';

@Component({
  selector: 'app-active-task-group',
  templateUrl: './active-task-group.component.html',
  styleUrl: './active-task-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveTaskGroupComponent {
  @Input() taskList: TaskList | undefined;
}
