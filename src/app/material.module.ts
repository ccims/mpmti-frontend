import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
