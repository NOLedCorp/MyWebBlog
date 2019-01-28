import { Component, OnInit, TemplateRef } from '@angular/core';
import { Person } from '../models/base';
import { DeveloperService } from '../services/Developer.Service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  user:Person;
  submitted = false;
  users:Person[];
  prevForm:FormGroup;
  modalRef2:BsModalRef;
  constructor(private ls:LoadService, private dv:DeveloperService, private fb:FormBuilder, private modalService: BsModalService) { }

  ngOnInit() {
    
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'));
    }
    this.prevForm = this.fb.group({
      UserId: ['', Validators.required],
      Root: ['', Validators.required],
    })
  }
  exit(){
    localStorage.removeItem('user');
    location.reload();
  }
  save(){
    this.submitted=true;
    if(this.prevForm.invalid){
      return;
    }
    this.ls.showLoad=true;
    this.dv.SetPrev({Root:this.prevForm.value.Root}, this.prevForm.value.UserId).subscribe((d)=>{
      this.submitted = false;
      this.modalRef2.hide()
      this.ls.showLoad=false;
    });
  }
  show(template: TemplateRef<any>){
    this.ls.showLoad=true;
    this.dv.GetUsers().subscribe(data =>{
      this.users=data;
      this.modalRef2 = this.modalService.show(template);
      this.ls.showLoad=false;
    });
    
  }
  close(){
    this.modalRef2.hide();
  }
  get f() { return this.prevForm.controls; }

}
