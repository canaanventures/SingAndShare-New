import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-lessonscompleted',
  templateUrl: './lessonscompleted.component.html',
  styleUrls: ['./lessonscompleted.component.css']
})
export class LessonscompletedComponent implements OnInit {
  menteelist:any=[]; tofilter:any=[]; originalfilter:any=[];

  @Input() filter = {Classes:'',mentor:'',Mentee:'',from_date:'',to_date:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getMenteeList();
  }

  getMenteeList(){
    this.restApi.getMethod('getMenteeLessonCompletedReport').subscribe((resp:any) => {
      this.menteelist = resp.data;
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
        if(item[type]){
          if(item[type].toLowerCase().indexOf(event.target.value.toLowerCase()) > -1){
            return item;
          }
        }
      })
    }  
    this.tofilter = result;
    this.menteelist = result;
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

  exportData() {
    var table = document.getElementById("mentee-excel-table") as HTMLTableElement;
    var rows =[]; var column1, column2, column3, column4;
    for(var i=0,row; row = table.rows[i];i++){
      if(!table.rows[i].classList.contains('excel-hide')){
        column1 = row.cells[0].innerText;
        column2 = row.cells[1].innerText;
        column3 = row.cells[2].innerText;
        column4 = row.cells[3].innerText;
        rows.push([column1, column2, column3, column4]);
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
    link.setAttribute("download", "lesson-completed-report.csv");
    document.body.appendChild(link);
    link.click();
  }

  filterDate(){
    this.restApi.getMethod('getMenteeNullLessonCompletedReport').subscribe((resp:any) => {
      this.menteelist = resp.data;
      this.tofilter = resp.data;
      this.originalfilter = resp.data;
    })
  }

  fromDateChange(){
    (<HTMLInputElement>document.getElementById("to_date")).min = this.filter.from_date;
    this.filter.to_date = this.filter.from_date;
  }

  reset(){
    this.menteelist = this.originalfilter;
    this.tofilter = this.originalfilter;
    this.filter = {Classes:'',mentor:'',Mentee:'',from_date:'',to_date:''}
  }

  printPageArea(){
    window.print();
  }

  generatePDF() {
    var data = document.getElementById('printable_box');
    html2canvas(data).then(canvas => {
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
      pdf.save('lesson-completed-report.pdf');
    });
  }
}
