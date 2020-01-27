import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectInformation } from 'src/app/types/types-interfaces';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.css']
})
export class CreateProjectDialogComponent implements OnInit {
  private generalInformation: FormGroup;
  private imsInformation: FormGroup;
  private rsInformation: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setGeneralInformation();
    this.setIMSInformation();
    this.setRSInformation();
    this.getProjectInformation();
  }
  protected getProjectInformation(): ProjectInformation {
    return {
      generalInformation: {
        projectName: this.generalInformation.controls.projectName.value,
        displayName: this.generalInformation.controls.displayName.value,
        projectOwnerName: localStorage.getItem('username')
      },
      imsInformation: {
        imsURL: this.imsInformation.controls.imsURL.value,
        imsProviderType: this.imsInformation.controls.imsProviderType.value,
        imsOwnerName: this.imsInformation.controls.imsOwnerName.value
      },
      rsInformation: {
        rsURL: this.rsInformation.controls.rsURL.value,
        rsProviderType: this.rsInformation.controls.rsProviderType.value,
        rsOwnerName: this.rsInformation.controls.rsOwnerName.value
      }
    };
  }

  private setGeneralInformation(): void {
    this.generalInformation = this.formBuilder.group({
      // TODO Check that project name is not used yet
      projectName: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-z]+(-[a-z]+)*$/)
        ]
      ],
      displayName: ['', Validators.required],
    });
  }

  private setIMSInformation(): void {
    this.imsInformation = this.formBuilder.group({
      imsURL: ['',
        [
          Validators.required,
          Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
        ]
      ],
      imsProviderType: ['', Validators.required],
      // TODO Check that account with such name exists
      imsOwnerName: ['',
        [
          Validators.required,
          Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
        ]
      ]
    });
  }

  private setRSInformation(): void {
    this.rsInformation = this.formBuilder.group({
      rsURL: ['',
        [
          Validators.required,
          Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
        ]
      ],
      rsProviderType: ['', Validators.required],
      // TODO Check that account with such name exists
      rsOwnerName: ['',
        [
          Validators.required,
          Validators.pattern(/^([a-zA-z]+[0-9]*)+$/)
        ]
      ]
    });
  }

  protected getGeneralInformation(): FormGroup {
    return this.generalInformation;
  }

  protected getIMSInformation(): FormGroup {
    return this.imsInformation;
  }

  protected getRSInformation(): FormGroup {
    return this.rsInformation;
  }
}
