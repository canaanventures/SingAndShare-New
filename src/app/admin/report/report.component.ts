import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { GoogleChartsModule } from 'angular-google-charts';
import jwt_decode from "jwt-decode";
//import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  title:any; 
  type:'ComboChart'; 
  data:any=[]; 
  options:any={}; 
  width:any;
  height:any;
  tk:any={};

  monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  @Input() report = {type:'',val:'',srs_id:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.report.srs_id = this.tk.srs_id;
    this.report.type = 'attendance';
    this.report.val = '2021-05';
    this.getAttendace();
  }

  changeDateFormat(resp){
    let dte = new Date(resp);
    return this.monthArr[(dte.getMonth()+1)]+' '+dte.getDate()+','+dte.getFullYear();
  }

  getAttendace(){
    //this.spinner.show();
    this.title = 'Fruits distribution';
    this.type = 'ComboChart';
    this.data = [
        ["Apples", 3, 2.5],
        ["Oranges",2, 2.5],
        ["Pears", 1, 3],
        ["Bananas", 3, 6],
        ["Plums", 4, 3]
    ];
    this.options = {   
        hAxis: {
          title: 'Person'
        },
        vAxis:{
          title: 'Fruits'
        },
        seriesType: 'bars',
        series: {1: {type: 'line',color: '#630460'}}
    };
    this.width = 550;
    this.height = 400;

    let dte = this.report.val;
    this.report.val = this.report.val.split('-')[1];
    this.restApi.postMethod('getReports',this.report).subscribe((resp:any) => {
      if(resp.data.length > 0){
        document.getElementById('report_chart_msg').style.display = 'none';
        document.getElementById('report_chart').style.display = 'block';
        
        if(this.report.type == 'attendance'){
          this.title = 'Attendance for '+this.monthArr[Number(this.report.val)-1]+', '+dte.split('-')[0];
          this.type = 'ComboChart';
          this.report.val = dte;
          let arr = [],childarr=[];
          for(var i=0;i<resp.data.length;i++){
            childarr.push(this.changeDateFormat(resp.data[i].meeting_date));
            childarr.push(resp.data[i].attendees);
            childarr.push(resp.data[i].new_attendees);
            arr.push(childarr);
            childarr = [];
          }
          this.data = arr;
          this.options = {   
              hAxis: {
                title: 'Date',
                textStyle : {
                  fontSize: 12, // or the number you want
                  color: "#de5d47",
                  fontName: "sans-serif",
                  bold: true,
                  italic: false
                },
                titleTextStyle:{
                  fontSize: 18, // or the number you want
                  color: "#630460",
                  fontName: '"Sofia", cursive',
                  bold: true,
                  italic: false
                }
              },
              vAxis:{
                title: 'Total Attendees',
                textStyle : {
                  fontSize: 12, // or the number you want
                  color: "#de5d47",
                  fontName: "sans-serif",
                  bold: true,
                  italic: false
                },
                titleTextStyle:{
                  fontSize: 18, // or the number you want
                  color: "#630460",
                  fontName: '"Sofia", cursive',
                  bold: true,
                  italic: false
                }
              },
              seriesType: 'bars',
              colors: ['#1dd8a8'],
              series: {1: {type: 'line',color: '#630460'}}
          };
          this.width = 550;
          this.height = 400;
        }
      }else{
        document.getElementById('report_chart').style.display = 'none';
        document.getElementById('report_chart_msg').style.display = 'block';
        this.report.val = dte;
      }
      //this.spinner.hide();
    });
  }
}
