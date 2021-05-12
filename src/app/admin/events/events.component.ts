import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { url } from 'src/app/shared/app.constant';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  public form : any;
  public formelem : any;
  public resp:any;
  public eventtypelist :any = [];
  public eventstatus :any = [];
  display='none'; typedisplay='none';
  public eventlist:any = [];
  public imgurl = url.imgurl;
  edit = false; startDate; endDate;
  tk:any = {};

  @Input() registeruser = {contact_sal:'',contact_first_name:'', contact_last_name:'', contact_email_id:'', contact_number:'',contact_state:'',contact_city:'',contact_address:'',contact_referrer:'',event_id:''};
  @Input() eventtype = {event_type:'',created_by_user_id:''}
  @Input() addevent = {event_id:'',event_name:'',event_start_date:'', event_end_date:'', cost_per_person:'', venue_name:'',description:'',event_type_id:'',created_by_user_id:'',modified_user_id:'',imgurl:'',status:''}; // ,event_status_id:''

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.getEventType();
    this.getEventStatus();
    this.getEvents();
  }

  addEvent(event:any){
    event.preventDefault();    
    this.edit = false;
    this.addevent.created_by_user_id = this.tk.user_id;
    this.restApi.postMethod('addEvent',this.addevent).subscribe((resp:any) => {
      this.resp = resp.data;
      this.getEvents();
      this.closeModal();
      alert(this.resp.message);
    })
  }

  changeDateFormat(newdte){
    let create_dte = new Date(newdte);
    let month, dte, hrs, mins;
    (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
    ((create_dte.getMonth()+1) < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
    (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
    (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();
    return create_dte.getFullYear()+'-'+month+'-'+dte+' '+hrs+':'+mins;
  }

  changeMinMax(newdte){
    let create_dte = new Date(newdte);
    let month, dte, hrs, mins;
    (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
    ((create_dte.getMonth()+1) < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
    (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
    (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();
    return create_dte.getFullYear()+'-'+month+'-'+dte+'T'+hrs+':'+mins;
  }

  updateEvent(event:any){
    event.preventDefault();    
    this.addevent.modified_user_id = this.tk.user_id;
    this.addevent.event_start_date = this.changeDateFormat((<HTMLInputElement>document.getElementById('event_start_date')).value);
    this.addevent.event_end_date = this.changeDateFormat((<HTMLInputElement>document.getElementById('event_end_date')).value);

    this.restApi.postMethod('editEvent',this.addevent).subscribe((resp:any) => {
      this.resp = resp.data;
      this.getEvents();
      this.closeModal();
      alert(this.resp.message);
    })
  }
  
  editEvent(id:any){
    this.edit = true;
    this.addevent.event_id = id;
    this.restApi.getMethod('getEvents/'+id).subscribe((resp:any) => {
      this.addevent = resp.data[0];
      this.openModal();
      setTimeout(function(){
        let create_dte = new Date(resp.data[0].event_start_date);
        let month, dte, hrs, mins;
        (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
        (create_dte.getMonth() < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
        (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
        (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();

        (<HTMLInputElement>document.getElementById('event_start_date')).value = create_dte.getFullYear()+'-'+month+'-'+dte+'T'+hrs+':'+mins;

        create_dte = new Date(resp.data[0].event_end_date);
        (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
        (create_dte.getMonth() < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
        (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
        (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();
        (<HTMLInputElement>document.getElementById('event_end_date')).value = create_dte.getFullYear()+'-'+month+'-'+dte+'T'+hrs+':'+mins;
      },100)
    });  
  }

  changeStatus(event,id){
    (event.target.checked) ? this.addevent.status = "Enable" : this.addevent.status = "Disable";
    this.addevent.modified_user_id = this.tk.user_id;
    this.addevent.event_id = id;
    this.restApi.postMethod('changeEventStatus',this.addevent).subscribe((data:any) => {
      this.getEvents();
      alert("The status of the event has been changed successfully");
    })
  }

  getEventType() {
    this.restApi.getMethod('getEventType')
      .subscribe((resp:any) => {
        this.eventtypelist = resp.data;
      })
  }

  getEvents() {
    this.restApi.getMethod('getEvents/all')
      .subscribe((resp) => {
        this.eventlist = resp;
      })
  }

  getEventStatus() {
    this.restApi.getMethod('getEventStatus')
      .subscribe((resp) => {
        this.eventstatus = resp;
      })
  }

  openModal(){
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    var dte = new Date();
    this.startDate = this.changeMinMax(dte);
    this.endDate = this.changeMinMax(dte);
  }

  startDteChange(){
    this.endDate = this.addevent.event_start_date;
  }

  closeModal() {
    this.display='none';
    this.typedisplay='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  openEventType(){
    this.typedisplay='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
  }

  addEventType(event:any){
    event.preventDefault();    
    this.eventtype.created_by_user_id = this.tk.user_id;
    this.restApi.postMethod('addEventType',this.eventtype).subscribe((resp:any) => {
      this.getEventType();
      this.closeModal();
      alert(resp.data[0].message);
    })
  }
}
