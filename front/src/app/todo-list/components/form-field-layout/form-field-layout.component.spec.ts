import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldLayoutComponent } from './form-field-layout.component';

describe('TaskListFormFieldComponent', () => {
  let component: FormFieldLayoutComponent;
  let fixture: ComponentFixture<FormFieldLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormFieldLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFieldLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
