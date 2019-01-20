import { BaseLink, BaseEntity, Person, Position } from "./base";
import { Status, Priority, Sphere, Type } from "./base";
import { Topic } from "./student";
export class Project extends BaseEntity{
    DateStart:Date;
    IsFinished:boolean;

    Requirements:Requirement[];
    Tasks:Task[];
    Team:ProjectPerson[];
}

export class Requirement extends BaseEntity{
    ProjectId:number;
    Status:Status;
}

export class Task extends Requirement{
    RequirementId:number;
    UserId:number;
    Priority:Priority;

    Requirement:Requirement;
    User:Person;
}

export class ProjectUsers{
    ProjectId:number;
    UserId:number;
    Position:Position;
}

export class Technology extends BaseEntity{
    Language:string;
    Sphere:Sphere;

    Topics:Topic[];
}
export class ProjectPerson{
    Id:number;
    Name:string;
    Email:string;
    Position:Position;
    ProjectId:number;

}