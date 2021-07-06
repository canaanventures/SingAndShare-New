import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-pcsreport',
  templateUrl: './pcsreport.component.html',
  styleUrls: ['./pcsreport.component.css']
})
export class PcsreportComponent implements OnInit {
  pcslist:any=[]; tofilter:any=[]; originalfilter:any=[]; srslist:any=[];

  @Input() filter = {member_name:'',current_status:'',from_date:'',to_date:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getpcsList();
  }

  getpcsList(){
    this.restApi.getMethod('getPCSReportList').subscribe((resp:any) => {
      this.pcslist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
      this.getSNSlist();
      //const count = array.reduce((acc, cur) => cur.id === id ? ++acc : acc, 0);
    })
  }

  getSNSlist(){
    this.restApi.getMethod('getSNSList').subscribe((resp:any) => {
      this.srslist = resp.data;
    })
  }

  filterList(event,type){
    var result;
    if(event.keyCode == 8 || event.keyCode == 46 || (type == 'current_status') || (type == 'srs_id')){
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
    this.pcslist = result;
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
    var table = document.getElementById("pcs-excel-table") as HTMLTableElement;
    var rows =[]; var column1, column2, column3, column4, column5, column6, column7;
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
    let arr = this.originalfilter; let f_date = this.filter.from_date; let t_date = this.filter.to_date;
    let result = arr.filter(function(item){
      if(!item.modified_date){
        if(new Date(f_date) <= new Date(item.created_on) && new Date(t_date) >= new Date(item.created_on)){
          return item;
        }
      }else{
        if(new Date(f_date) <= new Date(item.modified_date) && new Date(t_date) >= new Date(item.modified_date)){
          return item;
        }
      }
    })
    this.pcslist = result;
    this.tofilter = result;
  }

  fromDateChange(){
    (<HTMLInputElement>document.getElementById("to_date")).min = this.filter.from_date;
    this.filter.to_date = this.filter.from_date;
  }

  reset(){
    this.pcslist = this.originalfilter;
    this.tofilter = this.originalfilter;
    this.filter = {member_name:'',current_status:'',from_date:'',to_date:''}
  }
}
