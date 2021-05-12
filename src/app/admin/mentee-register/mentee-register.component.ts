import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'src/app/shared/app.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-mentee-register',
  templateUrl: './mentee-register.component.html',
  styleUrls: ['./mentee-register.component.css']
})
export class MenteeRegisterComponent implements OnInit {
  public decryptedInfo : any;

  @Input() userdetails = {user_first_name:'',user_last_name:'',user_email_id:'',user_password:'',user_contact_number:'',role_id:'',mentor_email_id:'',status:''};
  constructor(public restApi: ApiService, public router: Router, public activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    let param = this.activatedroute.snapshot.params;

    var deData= CryptoJS.AES.decrypt(decodeURIComponent(param.encodedurl), 'secret key 123'); 
    this.decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));

    (<HTMLInputElement>document.getElementById('mentee_reg_first_name')).value = this.decryptedInfo.first_name;
    (<HTMLInputElement>document.getElementById('mentee_reg_last_name')).value = this.decryptedInfo.last_name;
    (<HTMLInputElement>document.getElementById('mentee_reg_email_id')).value = this.decryptedInfo.email_id;
    (<HTMLInputElement>document.getElementById('mentor_email_id')).value = this.decryptedInfo.mentor_email_id;
  }

  register(){
    this.userdetails.user_first_name = (<HTMLInputElement>document.getElementById('mentee_reg_first_name')).value;
    this.userdetails.user_last_name = (<HTMLInputElement>document.getElementById('mentee_reg_last_name')).value;
    this.userdetails.user_email_id = (<HTMLInputElement>document.getElementById('mentee_reg_email_id')).value;
    this.userdetails.user_password = (<HTMLInputElement>document.getElementById('mentee_reg_your_password')).value;
    this.userdetails.user_contact_number = (<HTMLInputElement>document.getElementById('mentee_reg_contact_number')).value;
    this.userdetails.role_id = this.decryptedInfo.role_id;
    this.userdetails.mentor_email_id = (<HTMLInputElement>document.getElementById('mentor_email_id')).value;
    this.userdetails.status = "Enable";

    this.restApi.postMethod('register',this.userdetails)
      .subscribe((data:{}) => {
        //this.router.navigate(['register/' + this.encryptInfo]);
        alert('You have been registered successfully.');
      });
  }
}
