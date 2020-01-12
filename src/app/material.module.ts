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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
    imports: [MatNativeDateModule, MatDatepickerModule, MatIconModule,
        MatButtonModule, MatCheckboxModule, MatToolbarModule, FormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule, MatListModule, MatRadioModule,
        MatSidenavModule, MatExpansionModule, MatTooltipModule, MatTabsModule,
        MatSlideToggleModule
    ],

    exports: [MatNativeDateModule, FormsModule,
        MatDatepickerModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatToolbarModule, MatCardModule, MatFormFieldModule,
        MatInputModule, MatListModule, MatRadioModule,
        MatSidenavModule, MatExpansionModule, MatTooltipModule, MatTabsModule,
        MatSlideToggleModule
    ],

})

export class MaterialModule { }
