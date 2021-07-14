import { Component, OnInit } from '@angular/core';
import { intersectSpans } from '@fullcalendar/angular';
import { ApiService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-organizational-report',
  templateUrl: './organizational-report.component.html',
  styleUrls: ['./organizational-report.component.css']
})
export class OrganizationalReportComponent implements OnInit {
  ds:any={}; organizationlist:any=[];
  nodeHeadingProperty = "name";
  nodeContentProperty = "title";

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.getChartData();
  }

  getChartData(){
    /* this.ds = {
      id: '1',
      name: 'Lao Lao',
      title: 'general manager',
      children: [
        { id: '2', name: 'Bo Miao', title: 'department manager' },
        {
          id: '3',
          name: 'Su Miao',
          title: 'department manager',
          children: [
            { id: '4', name: 'Tie Hua', title: 'senior engineer' },
            {
              id: '5',
              name: 'Hei Hei',
              title: 'senior engineer',
              children: [
                { id: '6', name: 'Dan Zai', title: 'engineer' },
                { id: '7', name: 'Dan Dan', title: 'engineer' },
                { id: '8', name: 'Xiang Xiang', title: 'engineer' },
                { id: '9', name: 'Ke Xin', title: 'engineer' },
                { id: '10', name: 'Xiao Dan', title: 'engineer' },
                { id: '11', name: 'Dan Dan Zai', title: 'engineer' }
              ]
            },
            { id: '12', name: 'Pang Pang', title: 'senior engineer' },
            { id: '13', name: 'Er Pang', title: 'senior engineer' },
            { id: '14', name: 'San Pang', title: 'senior engineer' },
            { id: '15', name: 'Si Pang', title: 'senior engineer' }
          ]
        },
        { id: '16', name: 'Hong Miao', title: 'department manager' },
        { id: '17', name: 'Chun Miao', title: 'department manager' },
        { id: '18', name: 'Yu Li', title: 'department manager' },
        { id: '19', name: 'Yu Jie', title: 'department manager' },
        { id: '20', name: 'Yu Wei', title: 'department manager' },
        { id: '21', name: 'Yu Tie', title: 'department manager' }
      ]
    } */

    this.restApi.getMethod('getOrganizationalReport').subscribe((response:any) => {
      let resp = response.data; let arr = []; let obj = {}; let mainArr = [];
      for(var i=0; i<resp.length; i++){
        if(Object.keys(obj).length === 0 && obj.constructor === Object){
          if(resp[i].title != 'default@admin.com' && resp[i].parent_id != 0){
            arr.push(resp[i]);
          }
        }else if(resp[i].parent_id == obj['parent_id'] ){
          if(resp[i].title != 'default@admin.com'){
            arr.push(resp[i]);
          }
        }else{
          if(arr.length > 0){
            var result = resp.find(obj => {
              return obj.id === arr[0].parent_id
            }); 
            let obj1 = new Object;
            obj1['id'] = result.id;
            obj1['name'] = result.name;
            obj1['title'] = result.title;
            obj1['children'] = arr;
            mainArr.push(obj1);
            arr = [];
            arr.push(resp[i]);
          }
        }
        obj = resp[i];
      }
      this.ds = {
        id: '1',
        name: 'Sing And Share',
        title: 'Organizational Hierarchy',
        children: mainArr
      }
    })
  }
}
