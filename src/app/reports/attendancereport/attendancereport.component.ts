import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-attendancereport',
  templateUrl: './attendancereport.component.html',
  styleUrls: ['./attendancereport.component.css']
})
export class AttendancereportComponent implements OnInit {
  title:any; 
  type:'ComboChart'; 
  data:any=[];
  options:any={}; 
  width:any;
  height:any; lmsdisplay = false;
  tk:any={}; graphresp:any=[];
  attendancelist:any=[]; tofilter:any=[]; originalfilter:any=[]; srslist:any=[];

  monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  @Input() report = {type:'',val:'',srs_id:''}
  @Input() filter = {users_name:'',attendance_status:'',captain_name:''}
  @Input() filterdate = {from_date:'',to_date:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.graphInit();
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.report.srs_id = this.tk.srs_id;
    this.report.type = 'attendance';
    this.report.val = '2021-05';
    this.getAttendace();
    this.getAttendancelist();
  }

  changeDateFormat(resp){
    let dte = new Date(resp);
    return this.monthArr[dte.getMonth()]+' '+dte.getDate()+','+dte.getFullYear();
  }

  getAttendace(){
    //this.spinner.show();
    let dte = this.report.val;
    this.report.val = this.report.val.split('-')[1];
    this.restApi.postMethod('getReports',this.report).subscribe((resp:any) => {
      if(resp.data.length > 0){        
        if(this.report.type == 'attendance'){
          this.title = 'Attendance for '+this.monthArr[Number(this.report.val)-1]+', '+dte.split('-')[0];
          this.type = 'ComboChart';
          this.report.val = dte;
          let arr = [],childarr=[];
          for(var i=0;i<resp.data.length;i++){
            childarr.push(this.changeDateFormat(resp.data[i].meeting_date));
            childarr.push(resp.data[i].presentees);
            childarr.push(resp.data[i].absentees);
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
        this.report.val = dte;
      }
      this.graphresp = resp.data;
    });
  }

  graphInit(){
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
  }

  getAttendancelist(){
    this.restApi.getMethod('getAttendanceReportList').subscribe((resp:any) => {
      this.attendancelist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
      this.getSNSlist();
    })
  }

  getSNSlist(){
    this.restApi.getMethod('getSNSList').subscribe((resp:any) => {
      this.srslist = resp.data;
    })
  }

  filterList(event,type){
    var result;
    if((event.keyCode == 8 || event.keyCode == 46) || (type == 'attendance_status')){
      var el = Array.from(document.getElementsByClassName('filter-fld') as HTMLCollectionOf<HTMLElement>);
      let cnt = 0;
      for(var j=0; j<el.length ; j++){  
        if((el[j] as HTMLInputElement).value == ''){
          cnt++;
        }
      }
      if(cnt == el.length){
        result = this.originalfilter;
      }else{
        result = this.valFilter();
      }      
    }else{
      result = this.tofilter.filter(function(item){
        if(String(item[type].toLowerCase()).indexOf(String(event.target.value).toLowerCase()) > -1){
          return item;
        }
      })
    }
  
    this.tofilter = result;
    this.attendancelist = result;
  }

  valFilter(){
    var el = Array.from(document.getElementsByClassName('filter-fld') as HTMLCollectionOf<HTMLElement>);
    this.tofilter = [];
    var arr = this.originalfilter;
    var list =[];
    for(var j=0; j<el.length ; j++){     
      if((el[j] as HTMLInputElement).value != ''){
        for(var i=0; i<arr.length; i++){
          if(String(arr[i][el[j].id]).toLowerCase().indexOf(String((el[j] as HTMLInputElement).value).toLowerCase()) > -1){
            list.push(arr[i]);
          }
        }
      }
    }
    return list;
  }

  exportData() {
    var table = document.getElementById("pcs-excel-table") as HTMLTableElement;
    var rows =[]; var column1, column2, column3, column4, column5;
    for(var i=0,row; row = table.rows[i];i++){
      column1 = row.cells[0].innerText;
      column2 = row.cells[1].innerText;
      column3 = row.cells[2].innerText;
      column4 = row.cells[3].innerText;
      column5 = row.cells[4].innerText;
      rows.push([column1,column2,column3,column4,column5]);
    }
    var csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray){
      row = rowArray.join(",");
      csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mentors_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  filterDate(){
    this.restApi.postMethod('getAttendanceReportListByDate',this.filterdate).subscribe((resp:any) => {
      this.attendancelist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
    })
  }

  fromDateChange(){
    (<HTMLInputElement>document.getElementById("to_date")).min = this.filterdate.from_date;
    this.filterdate.to_date = this.filterdate.from_date;
  }

  reset(){
    this.filter = {users_name:'',attendance_status:'',captain_name:''}
    this.filterdate = {from_date:'',to_date:''}
    this.restApi.getMethod('getAttendanceReportList').subscribe((resp:any) => {
      this.attendancelist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
    })    
  }
}
