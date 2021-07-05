import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'src/app/shared/app.service';
import * as CryptoJS from 'crypto-js';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mentee-register',
  templateUrl: './mentee-register.component.html',
  styleUrls: ['./mentee-register.component.css']
})
export class MenteeRegisterComponent implements OnInit {
  public decryptedInfo : any;
  hide: boolean = true;
  hideconfirm: boolean = true;

  @Input() userdetails = {parent_id:'',user_first_name:'',user_last_name:'',user_email_id:'',user_password:'',user_confirm_password:'',user_contact_number:'',role_id:'',mentor_email_id:'',status:'',srs_id:''};
  constructor(public restApi: ApiService, public router: Router, public activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    document.getElementsByTagName('header')[0].style.display = 'none';
    let param = this.activatedroute.snapshot.params;

    var deData= CryptoJS.AES.decrypt(decodeURIComponent(param.encodedurl), 'secret key 123'); 
    this.decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));

    this.userdetails.user_first_name = this.decryptedInfo.first_name;
    this.userdetails.user_last_name = this.decryptedInfo.last_name;
    this.userdetails.user_email_id = this.decryptedInfo.email_id;
    this.userdetails.mentor_email_id = this.decryptedInfo.mentor_email_id;
  }

  toggleFieldTextType() {
    this.hide = !this.hide;
  }

  toggleFieldTextTypeConfirm() {
    this.hideconfirm = !this.hideconfirm;
  }

  register(f:NgForm){
   // event.preventDefault();
    this.userdetails.role_id = this.decryptedInfo.role_id;
    this.userdetails.srs_id = this.decryptedInfo.srs_id;
    this.userdetails.parent_id = this.decryptedInfo.parent_id;
    this.userdetails.status = "Enable";

    this.restApi.postMethod('register',this.userdetails).subscribe((data:any) => {
      alert(data.message);
      if(data.status == 200){
        location.href='/home';
      }
    });
  }
}
