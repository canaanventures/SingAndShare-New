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

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
  }

  visitorDetails(event) {
    event.preventDefault();
    this.visitorsdetails.visitor_name = (<HTMLInputElement>document.getElementById('visitor_name')).value;
    this.visitorsdetails.visitor_email_id = (<HTMLInputElement>document.getElementById('visitor_email_id')).value;
    this.visitorsdetails.visitor_subject = (<HTMLInputElement>document.getElementById('visitor_subject')).value;
    this.visitorsdetails.visitor_contact_number = (<HTMLInputElement>document.getElementById('visitor_contact_number')).value;
    this.visitorsdetails.message = (<HTMLInputElement>document.getElementById('message')).value;

    this.restApi.postMethod('visitors',this.visitorsdetails).subscribe((data:{}) => {     
      alert('Your Message has been sent successfully.')   
    })
  }
}
