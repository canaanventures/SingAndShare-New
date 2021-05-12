import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { url } from 'src/app/shared/app.constant';
import { state } from 'src/app/shared/app.state';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.css']
})
export class EventRegisterComponent implements OnInit {
  public resp : any;
  public option_str:any;

  @Input() verifyuser = {email:''};
  @Input() registeruser = {contact_sal:'',contact_first_name:'', contact_last_name:'', contact_email_id:'', contact_number:'',contact_state:'',contact_city:'',contact_address:'',contact_referrer:'',event_id:''};
  @Input() contactevent = {event_id:'', contact_id:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.print_state();
  }

  verifyEmail() {
    this.verifyuser.email = (<HTMLInputElement>document.getElementById('contact_email_id')).value;
    this.restApi.postMethod('checkUser',this.verifyuser).subscribe((data:{}) => {
      this.resp = data;
      if(this.resp.status == 201) {
        (<HTMLInputElement>document.getElementById('verify_email_btn')).style.display = 'none';
        var el = document.getElementsByClassName('hide-first');
        for(var i=0;i<el.length;i++){
          Array.from(document.getElementsByClassName('hide-first') as HTMLCollectionOf<HTMLElement>)[i].style.display = 'block';
        }
      }else{
        this.insertInContactEvent(this.verifyuser.email);
      }
    })
  }

  userEventRegister() {
    this.registeruser.contact_sal = (<HTMLInputElement>document.getElementById('contact_sal')).value;
    this.registeruser.contact_first_name = (<HTMLInputElement>document.getElementById('contact_first_name')).value;
    this.registeruser.contact_last_name = (<HTMLInputElement>document.getElementById('contact_last_name')).value;
    this.registeruser.contact_email_id = (<HTMLInputElement>document.getElementById('contact_email_id')).value;
    this.registeruser.contact_number = (<HTMLInputElement>document.getElementById('contact_number')).value;
    this.registeruser.contact_state = (<HTMLInputElement>document.getElementById('contact_state')).value;
    this.registeruser.contact_city = (<HTMLInputElement>document.getElementById('contact_city')).value;
    this.registeruser.contact_referrer = (<HTMLInputElement>document.getElementById('contact_referrer')).value;
    this.registeruser.contact_address = (<HTMLInputElement>document.getElementById('contact_address')).value;
    this.registeruser.event_id = (<HTMLInputElement>document.getElementById('event_hidden_id')).value;

    this.restApi.postMethod('registerUserForEvent',this.registeruser).subscribe((data:{}) => {     
      this.insertInContactEvent(this.registeruser.contact_email_id);      
    })
  }

  insertInContactEvent(emailid) {
    this.restApi.getMethod('getContact/'+emailid).subscribe((resp) => {
      this.contactevent.event_id = (<HTMLInputElement>document.getElementById('event_hidden_id')).value;
      this.resp = resp;
      this.contactevent.contact_id = this.resp.data[0].contact_id;

      this.restApi.postMethod('addToContactEvent',this.contactevent).subscribe((data:{}) => {
        alert('You have successfully registered yourself for the event.');
      });
    })
  }

  print_state(){
    this.option_str = document.getElementById("contact_state");
    this.option_str.length=0;
    this.option_str.options[0] = new Option('Select State','');
    this.option_str.selectedIndex = 0;
    for (var i=0; i< state.state_arr.length; i++) {
      this.option_str.options[this.option_str.length] = new Option(state.state_arr[i], state.state_arr[i]);
    }
  }

  print_city(event:Event){
    let city_index:number = event.target["selectedIndex"];
    this.option_str = document.getElementById("contact_city");
    this.option_str.length=0;
    this.option_str.options[0] = new Option('Select City','');
    this.option_str.selectedIndex = 0;
    let city_arr = state.s_a[city_index].split("|");
    for (var i=0; i<city_arr.length; i++) {
      this.option_str.options[this.option_str.length] = new Option(city_arr[i],city_arr[i]);
    }
  }
}
