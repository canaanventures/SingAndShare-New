import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.css']
})
export class MentorComponent implements OnInit {
  mentorlist:any=[]; tofilter:any=[]; originalfilter:any=[];
  
  @Input() filter = {mentee_name:'',user_contact_number:'',user_email_id:'',user_address:'',user_city:'',user_state:'',srs_name:'',mentor_name:'',status:'',from_date:'',to_date:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getMentorList();
  }

  getMentorList(){
    this.restApi.getMethod('getMentorReportList').subscribe((resp:any) => {
      this.mentorlist = resp.data;
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
    this.mentorlist = result;
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
    var table = document.getElementById("mentor-excel-table") as HTMLTableElement;
    var rows =[]; var column1, column2, column3, column4, column5, column6, column7, column8, column9, column10;
    for(var i=0,row; row = table.rows[i];i++){
      column1 = row.cells[0].innerText;
      column2 = row.cells[1].innerText;
      column3 = row.cells[2].innerText;
      column4 = row.cells[3].innerText;
      column5 = row.cells[4].innerText;
      column6 = row.cells[5].innerText;
      column7 = row.cells[6].innerText;
      column8 = row.cells[7].innerText;
      column9 = row.cells[8].innerText;
      column10 = row.cells[9].innerText;
      rows.push([column1,column2,column3,column4,column5,column6,column7,column8,column9,column10]);
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
    let arr = this.originalfilter; let f_date = this.filter.from_date; let t_date = this.filter.to_date;
    let result = arr.filter(function(item){
      if(new Date(f_date) <= new Date(item.modified_on) && new Date(t_date) >= new Date(item.modified_on)){
        return item;
      }
    })
    this.mentorlist = result;
    this.tofilter = result;
  }

  fromDateChange(){
    (<HTMLInputElement>document.getElementById("to_date")).min = this.filter.from_date;
    this.filter.to_date = this.filter.from_date;
  }

  reset(){
    this.mentorlist = this.originalfilter;
    this.tofilter = this.originalfilter;
    this.filter = {mentee_name:'',user_contact_number:'',user_email_id:'',user_address:'',user_city:'',user_state:'',srs_name:'',mentor_name:'',status:'',from_date:'',to_date:''}
  }
}
