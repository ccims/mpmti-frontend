import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponentDialogComponent } from '../dialogs/create-component-dialog-demo/create-component-dialog.component';
import { Project } from '../reducers/state';
import { ComponentPartial } from '../reducers/components.actions';
import { ApiService } from '../api/api.service';

@Component({
    selector: 'app-system-architecture-graph',
    templateUrl: './system-architecture-graph.component.html',
    styleUrls: ['./system-architecture-graph.component.css']
})
export class SystemArchitectureGraphComponent implements OnInit {

    @Input() project: Project;

    constructor(public dialog: MatDialog, private api: ApiService) { }

    ngOnInit() { }

    public openCreateComponentDialog(): void {
        const createComponentDialog = this.dialog.open(CreateComponentDialogComponent);

        createComponentDialog.afterClosed().subscribe((componentInformation: {ownerUsername: string, component: ComponentPartial}) => {
            // TODO add component to project, update graph and backend
            if (componentInformation) {
                console.log(componentInformation)
                this.api.addComponent(this.project.id, componentInformation.ownerUsername, componentInformation.component);
                //console.log(`Dialog result: ${componentInformation.generalInformation.componentName}`);
            }
        });
    }
}
