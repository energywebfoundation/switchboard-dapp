import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { JsonEditorComponent } from './components/json-editor.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [JsonEditorComponent],
  exports: [JsonEditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class JsonEditorModule {}
