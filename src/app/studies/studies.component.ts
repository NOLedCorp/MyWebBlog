import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/StudentService';
import { Person, BaseLink } from '../models/base';
import { Technology } from '../models/developer';
import { Paper, Topic } from '../models/student';
import { LoadService } from '../services/load.service';
import { DeveloperService } from '../services/Developer.Service';
declare var PR: any;
addEventListener('load', function(event) { PR.prettyPrint(); }, false);
@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.less']
})

export class StudiesComponent implements OnInit {
  tech:Technology;
  paper:Paper;
  techcopy:Technology;
  papercopy:Paper;
  user:Person;
  readonly=true;
  studyId:number;
  topicForm:FormGroup;
  type:string;
  parts = [];
  topparts = [false, false];
  ctopics = [];
  changing:string;
  submitted = false;
  links:BaseLink[];
  files:BaseLink[];
  yandexLink = false;
  fileSubmitted = false;
  constructor(private ls:LoadService, private dv:DeveloperService, private fb:FormBuilder, private route:ActivatedRoute, private router:Router, private ss:StudentService) { 
    this.route.params.subscribe(params=>this.studyId=Number(params['id']));
    this.route.queryParams.subscribe(
        (queryParam: any) => {
            this.type = queryParam['type'];
        }
    );
  }
  
  ngOnInit() {
    this.topicForm = this.fb.group({
      Name:['',Validators.required],
      Description:['',Validators.required]
    });
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'));
      if(this.user.Root==1){
        this.readonly = false;
      }
    }
    switch(this.type){
      case "tech":{
        this.ls.showLoad=true;
        this.ss.GetTech(this.studyId).subscribe(data => {
          this.tech=Object.assign({},data);
          this.links=this.tech.Links;
          this.files=this.tech.Files;
          for(let i = 0;i<this.tech.Topics.length;i++){
            this.parts.unshift(false);
            this.ctopics.unshift(false);
          }
          this.ls.showLoad=false;
        })
        
        break;
        
      }
      case "paper":{
        this.ls.showLoad=true;
        this.ss.GetPaper(this.studyId).subscribe(data => {
          this.paper=Object.assign({},data);
          this.links=this.paper.Links;
          for(let i = 0;i<this.paper.Topics.length;i++){
            this.parts.unshift(false);
            this.ctopics.unshift(false);
          }
          this.ls.showLoad=false;
        })
        
        break;
        
      }
    }
  }
  addTopic(){
    this.submitted = true;
    if(this.topicForm.invalid){
      return;
    }
    this.ls.showLoad=true;
    this.ss.AddTopic({OwnerId:this.type=='tech'?this.tech.Id:this.paper.Id, Name:this.topicForm.value.Name, Description:this.topicForm.value.Description, Type:this.type=='tech'?2:1, ModifyUserId:this.user.Id}).subscribe(()=>{
      this.submitted=false;
      
      this.ngOnInit();
    })
  }
  addLink(t,l){
    if(!(t.value && l.value)){
      return;
    }
    this.ls.showLoad=true;
    this.ss.AddLink({OwnerId:this.type=='tech'?this.tech.Id:this.paper.Id, Type:this.type=='tech'?2:1, Text:t.value, Path:l.value}).subscribe(()=>{
      t.value='';
      l.value='';
      this.ngOnInit();
    })
  }
  showPart(e,i){
    if(e.target.name!="change"){
      this.changing=null;
      this.ctopics = this.ctopics.map(x => false);
      this.parts[i]=!this.parts[i];
    }
  }
  changeTopic(i,t){
    this.changing=t;
    this.ctopics[i]=!this.ctopics[i];
  }
  showTopPart(i,e){
    console.log(e);
    if(e.target.name!="yandex"){
      this.topparts[i]=!this.topparts[i];
    }
  }
  showPPart(e,i, t){
    if(e.target.name!="change"){
      if(this.parts[i]){
        this.changing=null;
      }
      else{
        this.changing=t;
      }
      
      this.ctopics = this.ctopics.map(x => false);
      this.parts[i]=!this.parts[i];
    }
  }
  save(t:Topic){
    this.ls.showLoad=true;
    t.ModifyUserId=this.user.Id;
    this.ss.SaveTopic(t).subscribe(()=>{
      this.ngOnInit();
    })
  }
  sendYandexLink(){
    this.yandexLink = !this.yandexLink;
    this.fileSubmitted = false;
  }
  addFile(f){
    let files:File[] = f.files;
    this.fileSubmitted = true;
    console.log(files);
    if(!(files.length!=0)){
      return;
    }
    if(files[0].size>10000){
      return; 
    }
    this.fileSubmitted=false;
    const formData = new FormData();
    formData.append('Data', files[0]);
    this.ls.showLoad=true;
    this.dv.UploadFile(this.type=='tech'?this.tech.Id:this.paper.Id,this.type=='tech'?2:1, formData).subscribe(()=>{
      
      this.ngOnInit();
    })
  }
  addFileLink(t, l){
    if(!(t.value && l.value)){
      console.log(true);
      return;
    }
    this.ls.showLoad=true;
    this.ss.AddFileLink({OwnerId:this.type=='tech'?this.tech.Id:this.paper.Id, Type:this.type=='tech'?2:1, Text:t.value, Path:l.value}).subscribe(()=>{
      t.value='';
      l.value='';
      this.ngOnInit();
    })
  }
  get f() { return this.topicForm.controls; }

}


