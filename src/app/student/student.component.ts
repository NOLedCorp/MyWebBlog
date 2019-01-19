import { Component, OnInit } from '@angular/core';
import { News, Paper, Exam, } from '../models/student'
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { StudentService } from '../services/StudentService';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  modalRef2: BsModalRef;
  allnews:News[];
  ctrl = this;
  news = [];
  papers:Paper[];
  exams:Exam[];
  timesheet=[
    [{Name:'Математика', Lesson:1},{Name:'Программирование', Lesson:2},{Name:'-', Lesson:3},{Name:'Физика', Lesson:4},{Name:'-', Lesson:5}],
    [{Name:'Математика', Lesson:1},{Name:'Программирование', Lesson:2},{Name:'-', Lesson:3},{Name:'Физика', Lesson:4},{Name:'-', Lesson:5}],
    [{Name:'Математика', Lesson:1},{Name:'Программирование', Lesson:2},{Name:'-', Lesson:3},{Name:'Физика', Lesson:4},{Name:'-', Lesson:5}],
    [{Name:'Математика', Lesson:1},{Name:'Программирование', Lesson:2},{Name:'-', Lesson:3},{Name:'Физика', Lesson:4},{Name:'-', Lesson:5}],
    [{Name:'Математика', Lesson:1},{Name:'Программирование', Lesson:2},{Name:'-', Lesson:3},{Name:'Физика', Lesson:4},{Name:'-', Lesson:5}],
    [{Name:'Математика', Lesson:1},{Name:'Программирование', Lesson:2},{Name:'-', Lesson:3},{Name:'Физика', Lesson:4},{Name:'-', Lesson:5}]

  ];
  parts = [true, false, false, false];
  adding:string;
  constructor(private modalService: BsModalService, public ss: StudentService) { }
  ngOnInit() {
    this.ss.GetPapers().subscribe(data => {
      data.forEach(x => {
        x.ModifyDate = new Date(x.ModifyDate);
      });
      data.sort((a,b)=>{
        return a.ModifyDate<b.ModifyDate?1:-1;
      })
      this.papers = data;
    })
    let size = 3; //размер подмассива
    let subarray = []; //массив в который будет выведен результат.
    if(this.allnews){
      for (let i = 0; i <Math.ceil(this.allnews.length/size); i++){
        this.news[i] = this.allnews.slice((i*size), (i*size) + size);
      }
    }
    
    console.log(subarray);
  }
  closeForm(){
    if(this.adding=='paper'){
      this.ss.GetPapers().subscribe(data => {
        data.forEach(x => {
          x.ModifyDate = new Date(x.ModifyDate);
        });
        data.sort((a,b)=>{
          return a.ModifyDate<b.ModifyDate?1:-1;
        })
        this.papers = data;
        this.modalRef2.hide();
      })
    } 
    else{
      this.modalRef2.hide();
    }
    
    
  }
  chooseExam(Name){
    console.log(Name);
  }
  showPart(i){
    this.parts[i]=!this.parts[i];
  }
  addElem(i, template: TemplateRef<any>){
    this.adding = i;
    this.modalRef2 = this.modalService.show(template);
  }
}


