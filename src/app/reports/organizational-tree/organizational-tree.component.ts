import { Component, OnInit } from '@angular/core';
import { intersectSpans } from '@fullcalendar/angular';
import { ApiService } from 'src/app/shared/app.service';
import OrgChart from "@balkangraph/orgchart.js";

@Component({
  selector: 'app-organizational-tree',
  templateUrl: './organizational-tree.component.html',
  styleUrls: ['./organizational-tree.component.css']
})
export class OrganizationalTreeComponent implements OnInit {
  firstlevel:any=[];

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    //this.getChartData();
    this.getData(); 
  }

  getChartData(){
    this.restApi.getMethod('getOrganizationalReportFirstLevel').subscribe((resp:any) => {
      this.firstlevel = resp.data;
    })
  }

  toggleTree(id){
    this.restApi.getMethod('getOrganizationalLevelReport/'+id).subscribe((resp:any) => {
      //this.firstlevel = resp.data;
      let html = '';
      for(var i=0; i<resp.data; i++){
        html += `
          <span>resp</span>
        `
      }
      //document.getElementsByClassName('tree-level')[0].innerHTML = 
    })
  }

  getData(){
    this.restApi.getMethod('getNewOrganizationalReport').subscribe((resp:any) => {
      const tree = document.getElementById('tree');
      if (tree) {
        var chart = new OrgChart(tree, {
          nodeBinding: {
            field_0: "name",
            field_1: "title"
          },
        });
        chart.load(resp.data);
      }
    })
  }
}
