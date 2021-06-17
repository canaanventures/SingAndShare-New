import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { url } from 'src/app/shared/app.constant';
import jwt_decode from "jwt-decode";
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { formatDate } from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fellowship',
  templateUrl: './fellowship.component.html',
  styleUrls: ['./fellowship.component.css']
})
export class FellowshipComponent implements OnInit {
  tk:any = {};
  eventlist:any = [];
  viewdisplay = 'none';
  eventtypelist:any =[];
  display = 'none';
  startDate; endDate; access; encryptInfo;
  typeisevent = true;

  @Input() event = {connection_link:'',event_id:'',event_name:'',event_start_date:'', event_end_date:'', cost_per_person:'', venue_name:'',description:'',event_type_id:'',created_by_user_id:'',modified_user_id:'',imgurl:'',status:'',EventType:''};

  constructor(public restApi: ApiService,private http: HttpClient) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.getEvents();
    this.getEventType();
    this.encryptInfo = sessionStorage.getItem('access_token');
    if(this.encryptInfo){
      var deData= CryptoJS.AES.decrypt(decodeURIComponent(this.encryptInfo), 'secret key 123'); 
      this.access = JSON.parse(deData.toString(CryptoJS.enc.Utf8));
    }
  }
  calendarOptions: CalendarOptions;
  
  formatDate(resp){
    let dte = new Date(resp);
    let dtes,mon;
    (dte.getDate() < 10) ? dtes = '0'+dte.getDate() : dtes = dte.getDate();
    ((dte.getMonth()+1) < 10) ? mon = '0'+(dte.getMonth()+1) : mon = (dte.getMonth()+1);
    return dte.getFullYear() + '-' + mon + '-' + dtes;
  }

  formatDateTime(resp){
    let dte = new Date(resp);
    let dtes,mon;
    (dte.getDate() < 10) ? dtes = '0'+dte.getDate() : dtes = dte.getDate();
    ((dte.getMonth()+1) < 10) ? mon = '0'+(dte.getMonth()+1) : mon = (dte.getMonth()+1);
    return dte.getFullYear() + '-' + mon + '-' + dtes +' '+dte.getHours()+':'+dte.getMinutes();
  }

  viewEvent(param){
    this.restApi.getMethod('getEvents/'+param.event.id).subscribe((resp:any) => {
      this.event = resp.data[0];
      this.event.event_start_date = this.formatDateTime(resp.data[0].event_start_date);
      this.event.event_end_date = this.formatDateTime(resp.data[0].event_end_date);
      document.getElementsByTagName('body')[0].classList.add('modal-open');
      document.getElementsByTagName('html')[0].classList.add('modal-open');
      this.viewdisplay = 'block';
      this.typeisevent = true;
    });
  }

  viewCalendar(param){
    this.restApi.getMethod('getCalendar/'+param.event.id).subscribe((resp:any) => {
      this.event = resp.data[0];
      this.event.event_start_date = this.formatDateTime(resp.data[0].event_start_date);
      this.event.event_end_date = this.formatDateTime(resp.data[0].event_end_date);
      document.getElementsByTagName('body')[0].classList.add('modal-open');
      document.getElementsByTagName('html')[0].classList.add('modal-open');
      this.viewdisplay = 'block';
      this.typeisevent = false;
    });
  }

  getEvents(){
    this.restApi.getMethod('getEvents/all').subscribe((resp:any) => {
      let arr = resp.data;

      for(var i=0;i<arr.length;i++){
        if(arr[i].status == 'Enable'){
          let reqdte = this.formatDate(arr[i].event_start_date)
          this.eventlist.push({
            id: arr[i].event_id,
            title: arr[i].event_name,
            date: reqdte,
            groupId: 'event'
          })
        }
      }

      this.restApi.getMethod('getCalendar/all').subscribe((resp:any) => {
        let arr = resp.data;

        for(var i=0;i<arr.length;i++){
          let reqdte = this.formatDate(arr[i].event_start_date)
          this.eventlist.push({
            id: arr[i].calendar_id,
            title: arr[i].event_name,
            date: reqdte,
            groupId: 'calendar'
          })
        }
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          eventClick:(arg) =>{
            if(arg.event.groupId == 'event'){
              this.viewEvent(arg);
            }else{
              this.viewCalendar(arg);
            }
          },
          events: this.eventlist
        };
      });
    })
  }

  addEvent(f:NgForm){
    event.preventDefault();
    this.event.created_by_user_id = this.tk.user_id;
    this.restApi.postMethod('addCalendar',this.event).subscribe((resp:any) => {
      this.closeModal();
      alert("Event Added Successfully");
      setTimeout(function(){
        location.reload();
      },1000);
    })
  }

  closeModal() {
    this.viewdisplay='none';
    this.display='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.getElementsByTagName('html')[0].classList.remove('modal-open');
  }

  getEventType() {
    this.restApi.getMethod('getEventType')
      .subscribe((resp:any) => {
        this.eventtypelist = resp.data;
      })
  }

  startDteChange(){
    this.endDate = this.event.event_start_date;
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

  openModal(){
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    document.getElementsByTagName('html')[0].classList.add('modal-open');
    var dte = new Date();
    this.startDate = this.changeMinMax(dte);
    this.endDate = this.changeMinMax(dte);
  }
}
