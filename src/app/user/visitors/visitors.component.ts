import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { url } from 'src/app/shared/app.constant';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {
  @Input() visitorsdetails = {visitor_name:'', visitor_email_id:'', visitor_subject:'', visitor_contact_number:'',message:''}

  submitted :boolean = false;

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
  }

  onFormSubmit() {
    console.log("Full Address");  
  }

  visitorDetails(event) {
  	this.submitted = true;
    event.preventDefault();
    this.restApi.postMethod('visitors',this.visitorsdetails).subscribe((resp:any) => {     
      alert(resp.message);   
    })
  }
}