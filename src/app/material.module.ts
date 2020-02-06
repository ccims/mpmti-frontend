import { NgModule } from '@angular/core';
import {
    MatNativeDateModule, MatIconModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatRadioModule, MatListModule,
    MatStepperModule, MatDialogModule, MatSelectModule, MatSlideToggleModule,
    MatTabsModule, MatTooltipModule, MatExpansionModule, MatSidenavModule,
    MatDatepickerModule, MatDividerModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [MatNativeDateModule, MatDatepickerModule, MatIconModule,
        MatButtonModule, MatCheckboxModule, MatToolbarModule, FormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatRadioModule,
        MatSidenavModule, MatExpansionModule, MatTooltipModule, MatTabsModule,
        MatSlideToggleModule, MatSelectModule, MatDialogModule, MatStepperModule,
        MatDividerModule
    ],

    exports: [MatNativeDateModule, FormsModule,
        MatDatepickerModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatToolbarModule, MatCardModule, MatFormFieldModule,
        MatInputModule, MatListModule, MatRadioModule,
        MatSidenavModule, MatExpansionModule, MatTooltipModule, MatTabsModule,
        MatSlideToggleModule, MatSelectModule, MatDialogModule, MatStepperModule,
        MatDividerModule
    ],

})

export class MaterialModule { }
