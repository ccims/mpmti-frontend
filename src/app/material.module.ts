import { NgModule } from '@angular/core';
import {
    MatNativeDateModule, MatIconModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatRadioModule, MatListModule,
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
    imports: [MatNativeDateModule, MatDatepickerModule, MatIconModule,
        MatButtonModule, MatCheckboxModule, MatToolbarModule, FormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatRadioModule,
        MatSidenavModule, MatExpansionModule, MatTooltipModule, MatTabsModule,
        MatSlideToggleModule, MatSelectModule, MatDialogModule, MatStepperModule
    ],

    exports: [MatNativeDateModule, FormsModule,
        MatDatepickerModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatToolbarModule, MatCardModule, MatFormFieldModule,
        MatInputModule, MatListModule, MatRadioModule,
        MatSidenavModule, MatExpansionModule, MatTooltipModule, MatTabsModule,
        MatSlideToggleModule, MatSelectModule, MatDialogModule, MatStepperModule
    ],

})

export class MaterialModule { }
