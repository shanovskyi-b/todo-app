import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-styleguide',
  templateUrl: './styleguide.component.html',
  styleUrl: './styleguide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StyleguideComponent {

}
