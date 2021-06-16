import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-lmsreport',
  templateUrl: './lmsreport.component.html',
  styleUrls: ['./lmsreport.component.css']
})
export class LmsreportComponent implements OnInit {
  lmsclass:any=[]; tofilter:any=[]; originalfilter:any=[];

  @Input() filter = {course_name:'',class_name:'',category_name:'',instructor_name:'',from_date:'',to_date:'',class_status:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getlmsclass();
  }

  getlmsclass(){
    this.restApi.getMethod('getLMSReportList').subscribe((resp:any) => {
      this.lmsclass = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
    })
  }

  filterList(event,type){
    var result;
    if(event.keyCode == 8 || event.keyCode == 46 || (type == 'status')){
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
        if(item[type].toLowerCase().indexOf(event.target.value.toLowerCase()) > -1){
          return item;
        }
      })
    }
  
    this.tofilter = result;
    this.lmsclass = result;
  }

  valFilter(){
    var el = Array.from(document.getElementsByClassName('filter-fld') as HTMLCollectionOf<HTMLElement>);
    this.tofilter = [];
    var arr = this.originalfilter;
    var list =[];
    for(var j=0; j<el.length ; j++){     
      if((el[j] as HTMLInputElement).value != ''){
        for(var i=0; i<arr.length; i++){
          if(arr[i][el[j].id].toLowerCase().indexOf((el[j] as HTMLInputElement).value.toLowerCase()) > -1){
            list.push(arr[i]);
          }
        }
      }
    }
    return list;
  }

  exportData() {
    var table = document.getElementById("mentee-excel-table") as HTMLTableElement;
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
    link.setAttribute("download", "lmsclass_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  filterDate(){
    let arr = this.originalfilter; let f_date = this.filter.from_date; let t_date = this.filter.to_date; let result = [];
    let status = this.filter.class_status;
    if(status == ''){
      result = arr;
    }else{
      result = arr.filter(function(item){
        if(status == 'progress'){
          if((new Date(f_date) <= new Date(item.end_date) && new Date(t_date) >= new Date(item.end_date)) || (new Date(f_date) <= new Date(item.start_date) && new Date(t_date) < new Date(item.end_date))){
            return item;
          }
        }else if(status == 'complete'){
          if(new Date(f_date) > new Date(item.end_date)){
            return item;
          }
        }  
      })
    }
    this.lmsclass = result;
    this.tofilter = result;
  }

  fromDateChange(){
    (<HTMLInputElement>document.getElementById("to_date")).min = this.filter.from_date;
    this.filter.to_date = this.filter.from_date;
  }

  reset(){
    this.lmsclass = this.originalfilter;
    this.tofilter = this.originalfilter;
    this.filter = {course_name:'',class_name:'',category_name:'',instructor_name:'',from_date:'',to_date:'',class_status:''}
  }
}
