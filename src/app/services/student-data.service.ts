import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface Student {
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  dob: Date;
  addressType: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  pincode: string;
  englishMarks: number;
  hindiMarks: number;
  politicalScienceMarks: number;
  geographyMarks: number;
  mathematicsMarks: number;
  totalMarks: number;
  grade: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  private studentsSource = new BehaviorSubject<Student[]>([]);
  private currentStudentSource = new BehaviorSubject<Student | null>(null);

  students = this.studentsSource.asObservable();
  currentStudent = this.currentStudentSource.asObservable();

  addStudent(student: Student): void {
    const currentStudents = this.studentsSource.getValue();
    this.studentsSource.next([...currentStudents, student]);
    console.log(student)
  }

  constructor() { }

  
  setCurrentStudent(student: Student): void {
    this.currentStudentSource.next(student);
    console.log(student);

  }

  clearCurrentStudent(): void {
    this.currentStudentSource.next(null);
  }
}
