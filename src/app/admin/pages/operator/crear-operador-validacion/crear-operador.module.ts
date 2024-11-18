import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { ChipModule } from "primeng/chip";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { CrearOperadorComponent } from './crear-operador.component';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TableModule } from 'primeng/table';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		CommonModule,
		FormsModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		ColorPickerModule,
		CascadeSelectModule,
		MultiSelectModule,
		ToggleButtonModule,
		SliderModule,
		InputTextareaModule,
		RadioButtonModule,
		InputTextModule,
		RatingModule,
		ChipModule,
		KnobModule,
		InputSwitchModule,
		ListboxModule,
		SelectButtonModule,
		CheckboxModule,
		ButtonModule,
		InputGroupModule,
		InputGroupAddonModule,
		FileUploadModule,
		DialogModule,
        LeafletModule,
        TableModule,
		NgClass,
        ReactiveFormsModule,
        NgxMaskDirective, NgxMaskPipe
	],
	declarations: [CrearOperadorComponent],
    providers: [provideNgxMask()]
})
export class CrearOperadorModule { }
