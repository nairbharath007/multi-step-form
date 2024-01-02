import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentDataService, Student } from 'src/app/services/student-data.service';


interface Country {
  name: string;
  states: string[];
}

// Sample data
interface Country {
  name: string;
  states: string[];
}

const COUNTRIES: Country[] = [
  { 
    name: 'United States', 
    states: ['California', 'Texas', 'Florida', 'New York', 'Illinois'] 
  },
  { 
    name: 'India', 
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal'] 
  },
  { 
    name: 'Australia', 
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'] 
  },
  { 
    name: 'Canada', 
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'] 
  }
  // ... add other countries and states as needed
];




@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  isReadOnly: boolean = false;
  studentForm!: FormGroup;
  currentStep = 1;
  progressWidth = '33%';
  totalMarks: number = 0;
  grade: string = '';

  countries = COUNTRIES;

  states: string[] = [];

  isSumCalculated = false

  constructor(private fb: FormBuilder, 
    private studentDataService: StudentDataService,
    private router: Router
    ) {}


    ngOnInit(): void {
      this.initForm();
      this.studentDataService.currentStudent.subscribe(student => {
        if (student) {
          this.isReadOnly = true;
          this.studentForm.patchValue(student);
          this.totalMarks = student.totalMarks;
          this.grade = student.grade; 
          this.studentForm.disable();
        } else {
          this.isReadOnly = false;
          this.studentForm.enable();
          this.studentForm.reset();
        }
      });
    }


  initForm(): void {
    this.studentForm = this.fb.group({
      // Student Information
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      middleName: ['', Validators.pattern(/^[a-zA-Z\s]*$/)],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      sex: ['', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      

      // Address Information
      addressType: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required,  Validators.pattern(/^[0-9]*$/), Validators.minLength(4), Validators.maxLength(8)]],

      // Education Details
      englishMarks: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      hindiMarks: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      politicalScienceMarks: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      geographyMarks: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      mathematicsMarks: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.studentDataService.currentStudent.subscribe(student => {
      if (student) {
        this.isReadOnly = true;
        this.studentForm.patchValue(student);
        this.studentForm.disable(); // read- only
      }
    });
  }

  //===================VALIDATIONS=========================================

  // Custom validator for the date of birth
  dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // If no value is set, don't apply these validations
    }
  
    const currentDate = new Date();
    //currentDate.setHours(0, 0, 0, 0); // Remove time part for comparison
    const inputDate = new Date(control.value);
    console.log(inputDate)
  
    if (inputDate > currentDate) {
      return { futureDate: true }; // Error if the date is in the future
    }
  
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
    if (inputDate > fiveYearsAgo) {
      return { tooYoung: true }; // Error if the date indicates age less than 5 years
    }
  
    return null;
  }


  convertToUpper(event: any): void {
    const upperValue = event.target.value.toUpperCase();
    this.studentForm.get('pincode')?.setValue(upperValue, { emitEvent: false });
  }

  //================VALIDATIONS END===================================


  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.progressWidth = `${this.currentStep * 33}%`; 
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.progressWidth = `${this.currentStep * 33}%`;
    }
  }

  onCountryChange(): void {
    const selectedCountry = this.studentForm.get('country')?.value;
    const countryData = COUNTRIES.find(country => country.name === selectedCountry);

    this.states = countryData ? countryData.states : [];
  }

  calculateSum(): void {
    this.isSumCalculated = true;
    const marks = ['englishMarks', 'hindiMarks', 'politicalScienceMarks', 'geographyMarks', 'mathematicsMarks'];
    this.totalMarks = marks.reduce((acc, mark) => acc + (this.studentForm.get(mark)?.value ?? 0), 0);
    this.grade = this.calculateGrade(this.totalMarks / marks.length);
  }

  calculateGrade(average: number): string {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    if (average >= 50) return 'E';
    return 'F'; 
}


  onSubmit(): void {
    if (this.studentForm.valid) {
      this.calculateSum();
      const grade = this.calculateGrade(this.totalMarks / 5); 

      const studentData: Student = {
        ...this.studentForm.value,
        totalMarks: this.totalMarks,
        grade: grade
      };

      this.studentDataService.addStudent(studentData);
      
      this.router.navigate(['/dashboard']);
    }
  }

  resetForm(): void {
    this.studentForm.reset();
    this.currentStep = 1;
    this.progressWidth = '33%';
    this.totalMarks = 0;
    this.grade = '';
  }
}