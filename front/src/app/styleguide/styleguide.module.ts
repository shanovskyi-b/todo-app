import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleguideComponent } from './styleguide.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    StyleguideComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class StyleguideModule { }
