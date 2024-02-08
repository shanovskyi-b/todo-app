import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleguideComponent } from './styleguide.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { StyleguideRoutingModule } from './styleguide-routing.module';


@NgModule({
  declarations: [
    StyleguideComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    StyleguideRoutingModule,
  ],
})
export class StyleguideModule { }
