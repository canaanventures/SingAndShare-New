import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-meetingcount',
  templateUrl: './meetingcount.component.html',
  styleUrls: ['./meetingcount.component.css']
})
export class MeetingcountComponent implements OnInit {
  snslist:any=[]; tofilter:any=[]; originalfilter:any=[];

  @Input() filter = {srs_name:'',from_date:'',to_date:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getsnslist();
  }

  getsnslist(){
    this.restApi.getMethod('monthlyAttendance').subscribe((resp:any) => {
      this.snslist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
      //const count = array.reduce((acc, cur) => cur.id === id ? ++acc : acc, 0);
    })
  }

  filterList(event,type){
    var result;
    if(event.keyCode == 8 || event.keyCode == 46){
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
        if(item[type]){
          if(item[type].toLowerCase().indexOf(event.target.value.toLowerCase()) > -1){
            return item;
          }
        }
      })
    }
  
    this.tofilter = result;
    this.snslist = result;
  }

  valFilter(){
    var el = Array.from(document.getElementsByClassName('filter-fld') as HTMLCollectionOf<HTMLElement>);
    this.tofilter = [];
    var arr = this.originalfilter;
    var list =[];
    for(var j=0; j<el.length ; j++){     
      if((el[j] as HTMLInputElement).value != ''){
        for(var i=0; i<arr.length; i++){
          if(arr[i][el[j].id]){
            if(arr[i][el[j].id].toLowerCase().indexOf((el[j] as HTMLInputElement).value.toLowerCase()) > -1){
              list.push(arr[i]);
            }
          }
        }
      }
    }
    return list;
  }

  filterDate(){
    let arr = this.originalfilter; let f_date = this.filter.from_date; let t_date = this.filter.to_date;
    let result = arr.filter(function(item){
      if(new Date(f_date) <= new Date(item.month) && new Date(t_date) >= new Date(item.month)){
        return item;
      }
    })
    this.snslist = result;
    this.tofilter = result;
  }

  fromDateChange(){
    (<HTMLInputElement>document.getElementById("to_date")).min = this.filter.from_date;
    this.filter.to_date = this.filter.from_date;
  }

  reset(){
    this.snslist = this.originalfilter;
    this.tofilter = this.originalfilter;
    this.filter = {srs_name:'',to_date:'',from_date:''}
  }

  exportData() {
    var table = document.getElementById("sns-excel-table") as HTMLTableElement;
    var rows =[]; var column1, column2, column3;
    for(var i=0,row; row = table.rows[i];i++){
      if(!table.rows[i].classList.contains('excel-hide')){
        column1 = row.cells[0].innerText;
        column2 = row.cells[1].innerText;
        column3 = row.cells[2].innerText;
        rows.push([column1,column2,column3]);
      }
    }
    var csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray){
      row = rowArray.join(",");
      csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "meeting-count-report.csv");
    document.body.appendChild(link);
    link.click();
  }

  printPageArea(){
    window.print();
  }

  generatePDF() {
    var data = document.getElementById('printable_box');
    html2canvas(data).then(canvas => {
      debugger;
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('meeting-count-report.pdf');
    });
  }
}
