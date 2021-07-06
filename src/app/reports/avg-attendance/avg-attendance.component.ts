import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-avg-attendance',
  templateUrl: './avg-attendance.component.html',
  styleUrls: ['./avg-attendance.component.css']
})
export class AvgAttendanceComponent implements OnInit {
  title:any; type:'BarChart'; data:any=[]; options:any={}; columnNames:any=[];
  tk:any={}; graphresp:any=[];
  width:any; height:any;
  monthArr = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  @Input() report = {type:'',val:'',srs_id:'',mon:new Date().getMonth()}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.report.srs_id = this.tk.srs_id;
    this.graphInit();
    this.getAttendace('load');
    let mth;
    new Date().getMonth() < 10 ? mth = '0'+new Date().getMonth() : mth = new Date().getMonth();
    this.report.val = new Date().getFullYear() +'-'+ mth;
  }

  graphInit(){
    this.title = '';
    this.type = 'BarChart';
    this.data = [];
    this.columnNames = [];
    this.options = { 
      colors: ['#1dd8a8']
    };
    this.width = 550;
    this.height = 400;
  }

  getAttendace(type){
    if(type == 'click'){
      var mth = this.report.val.split('-')[1];
      this.report.mon = parseInt(mth, 10);
    }
    this.restApi.getMethod('getAvgAttendanceReportList/'+this.report.mon).subscribe((resp:any) => {
      this.title = 'Attendance for '+this.monthArr[this.report.mon - 1];
      this.type = 'BarChart';
      let arr = [],childarr=[];
      for(var i=0;i<resp.data.length;i++){
        childarr.push(resp.data[i].srs_name);
        childarr.push(Number(resp.data[i].total));
        arr.push(childarr);
        childarr = [];
      }
      this.data = arr;
    });
  }
}
