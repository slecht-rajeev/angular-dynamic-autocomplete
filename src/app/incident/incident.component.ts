import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss']
})
export class IncidentComponent implements OnInit{
  profileForm: any;


  ngOnInit(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl(''),
    });
  }


  formsubmit(event: any) {
    console.log(event);

    console.log(this.profileForm.controls['firstname'].value);
  }
}
