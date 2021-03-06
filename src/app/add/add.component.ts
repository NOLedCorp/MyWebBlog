import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Priority, Status, Person } from '../models/base';
import { ProjectUsers, ProjectPerson, Requirement } from '../models/developer';
import { DeveloperService } from '../services/Developer.Service';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  taskForm:FormGroup;
  reqForm:FormGroup;
  type:String;
  submitted = false;
  team:ProjectPerson[];
  reqs:Requirement[];
  ProjectId:String;
  user:Person;
  constructor(private ls:LoadService, private fb:FormBuilder, private route:ActivatedRoute, private router:Router, private dv:DeveloperService) { 
    this.route.params.subscribe(params=>this.ProjectId=params['id']);
    this.route.queryParams.subscribe(
        (queryParam: any) => {
            this.type = queryParam['type'];
        }
    );
  }

  ngOnInit() {
    let load = [true, true];
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'));
    }
    this.ls.showLoad=true;
    this.dv.GetTeam(this.ProjectId).subscribe(data => {
      this.team = data;
      load[0] =true;
      this.ls.showLoad=!(load[0] == load[1]);
    })
    this.dv.GetRequirements(this.ProjectId).subscribe(data => {
      this.reqs = data;
      load[1]=true;
      this.ls.showLoad=!(load[0] == load[1]);

    })
    this.taskForm = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      RequirementId: ['', Validators.required],
      UserId: ['', Validators.required],
      Priority: ['Low', Validators.required]
    })
    this.reqForm = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required]
    })
  }
  getPriorities(){
    return [Priority.Low, Priority.Medium, Priority.Hight];
  }
  addTask(){
    this.submitted = true;
    if(this.taskForm.invalid){
      return;
    }
    this.ls.showLoad=true;
    this.dv.AddTask({Name:this.taskForm.value.Name, Description:this.taskForm.value.Description, RequirementId:this.taskForm.value.RequirementId, UserId:this.taskForm.value.UserId, Priority:this.taskForm.value.Priority, Status:Status.Proposed, ProjectId:this.ProjectId, ModifyUserId:this.user.Id}).subscribe(data => {
      this.submitted = false;
      this.router.navigate(
          ['/projects', this.ProjectId]
      );
      this.ls.showLoad=false;
    })
  }
  addReq(){

    this.submitted = true;
    if(this.reqForm.invalid){
      return;
    }
    this.ls.showLoad=true;
    this.dv.AddRequirement({Name:this.reqForm.value.Name, Description:this.reqForm.value.Description, ProjectId:this.ProjectId, Status:Status.Proposed, ModifyUserId:this.user.Id}).subscribe(data => {
      this.submitted = false;
      this.router.navigate(
          ['/projects', this.ProjectId]
      );
      this.ls.showLoad=false;
    })
  }
  get f() { return this.type=='req'?this.reqForm.controls:this.taskForm.controls }

}
