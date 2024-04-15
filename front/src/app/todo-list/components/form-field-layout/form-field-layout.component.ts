import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-field-layout',
  templateUrl: './form-field-layout.component.html',
  styleUrl: './form-field-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldLayoutComponent implements DoCheck {
  @Input() taskListInputValue: string = '';
  @Output() taskListInput = new EventEmitter<string>();
  @Output() taskListInputBlur = new EventEmitter();

  @ViewChild('inputLayout') inputLayout: ElementRef | undefined;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngDoCheck() {
    this.changeDetectorRef.detectChanges();
    this.inputLayout?.nativeElement.focus()
  }

  handleConfirmation (value: string): void {
    this.taskListInput.emit(value)
  }
  
  onBlur(): void {
    setTimeout(() => {
      this.taskListInputBlur.emit();
    }, 150)
  }
}
