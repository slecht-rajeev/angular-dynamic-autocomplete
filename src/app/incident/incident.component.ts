import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss']
})
export class IncidentComponent implements OnInit{
  profileForm: any;


  ngOnInit(): void {
    this.profileForm = new FormGroup({
      username1: new FormControl(''),
      username: new FormControl('', Validators.required),
    });
  }


  formsubmit(event: any) {
    console.log(event);

    console.log(this.profileForm.controls.username.value)

    // https://github.com/DMezhenskyi/angular-cdk-lessons/tree/master/src/app/advanced-search-control/custom-form-field-control
  }
}
