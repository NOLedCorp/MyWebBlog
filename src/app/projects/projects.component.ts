import { Component, OnInit } from '@angular/core';
import { DeveloperService } from '../services/Developer.Service';
import { Person, Position } from '../models/base';
import { ProjectPerson, Project } from '../models/developer'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {
  modalRef2: BsModalRef;
  parts = [true, false];
  userForm:FormGroup;
  project:Project;
  submitted = false;
  user:Person;
  users:Person[] =[];
  constructor(private ls:LoadService, private router: Router, private dv:DeveloperService, public fb:FormBuilder, private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    let load = [true, true];
    this.ls.showLoad=true;
    this.dv.GetUsers().subscribe(data =>{
      this.users=data;
      load[0]=false;
      this.ls.showLoad=!(load[0] == load[1]);
    });
    this.dv.GetProject(this.route.snapshot.paramMap.get("id")).subscribe(data =>{
      this.project=data;
      load[1]=false;
      this.ls.showLoad=!(load[0] == load[1]);
    });
    this.userForm = this.fb.group({
      Id: ['', Validators.required],
      Position: [this.getPositions()[0], Validators.required]
    })
    
  }
  
  save(){
    this.submitted=true;
    if(this.userForm.invalid){
      return;
    }
    this.ls.showLoad=true;
    this.dv.AddProjectUser({Id:this.userForm.value.Id, ProjectId:this.project.Id, Position:this.userForm.value.Position}).subscribe((data)=>{
      this.dv.GetProject(this.route.snapshot.paramMap.get("id")).subscribe(data =>{

        this.project=data;
        this.submitted = false;
        this.modalRef2.hide();
        this.ls.showLoad=false;
      });
      
    });
    
  }
  close(){
    this.modalRef2.hide();
    
  }
  show(t:TemplateRef<any>){
    this.modalRef2 = this.modalService.show(t);
  }
  getPositions(){
    return [Position.BackDeveloper, Position.FrontDeveloper, Position.TeamLead, Position.DataBaseDeveloper, Position.Designer];
  }
  showPart(i){
    this.parts[i]=!this.parts[i];
  }
  add(t){
    this.router.navigate(
        ['/add', this.project.Id], 
        {
            queryParams:{
                'type':t 
            }
        }
    );
  }
  open(t, id){
    this.router.navigate(
        ['/works', id], 
        {
            queryParams:{
                'type':t 
            }
        }
    );
  }
  get f() { return this.userForm.controls; }

}
