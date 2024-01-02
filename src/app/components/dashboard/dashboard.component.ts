import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDataService, Student } from 'src/app/services/student-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  students: Student[] = [];

  constructor(private studentDataService: StudentDataService, private router: Router) {}

  ngOnInit(): void {
    this.studentDataService.students.subscribe(data => this.students = data);
  }


addNewStudent(): void {
  this.studentDataService.clearCurrentStudent(); 
  this.router.navigate(['/add-student']);
}


  viewStudent(student: Student): void {
    this.studentDataService.setCurrentStudent(student);
    this.router.navigate(['/add-student']);
  }
}