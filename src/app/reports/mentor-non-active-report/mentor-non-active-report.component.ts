import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-mentor-non-active-report',
  templateUrl: './mentor-non-active-report.component.html',
  styleUrls: ['./mentor-non-active-report.component.css']
})
export class MentorNonActiveReportComponent implements OnInit {
  attendancelist:any=[]; tofilter:any=[]; originalfilter:any=[]; srslist:any=[];

  @Input() filter = {mentor_name:'',srs_name:'',current_status:'',status:''}
  @Input() filterdate = {from_date:'',to_date:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getMentorlist();
  }

  getMentorlist(){
    this.restApi.getMethod('getMentorNonActiveReportList').subscribe((resp:any) => {
      this.attendancelist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
    })
  }

  filterList(event,type){
    var result;
    if((event.keyCode == 8 || event.keyCode == 46) || (type == 'srs_id') || (type == 'status')){
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
        if(String(item[type]).toLowerCase().indexOf(String(event.target.value).toLowerCase()) > -1){
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
    var rows =[]; var column1, column2, column3, column4, column5, column6;
    for(var i=0,row; row = table.rows[i];i++){
      column1 = row.cells[0].innerText;
      column2 = row.cells[1].innerText;
      column3 = row.cells[2].innerText;
      column4 = row.cells[3].innerText;
      column5 = row.cells[4].innerText;
      column6 = row.cells[5].innerText;
      rows.push([column1,column2,column3,column4,column5,column6]);
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
    this.restApi.postMethod('getMentorActivityReportByDate',this.filterdate).subscribe((resp:any) => {
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
    this.filter = {mentor_name:'',srs_name:'',current_status:'',status:''}
    this.filterdate = {from_date:'',to_date:''}
    this.getMentorlist();
  }
}
