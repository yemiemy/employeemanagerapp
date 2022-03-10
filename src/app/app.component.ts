import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeemanagerapp';
    
  public employees : Employee[] = [];
  public editEmployee : Employee | null = null;
  public deleteEmployee: Employee;
  
  constructor(private employeeService : EmployeeService){}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse)=> {
        alert(error.message);
      }
    )
  }

  public onAddEmployee(addForm : NgForm) : void {
    document.getElementById("add-employee-form").click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response : Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee : Employee) : void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response : Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId : number) : void {
    document.getElementById("delete-employee").click();
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response : void) => {
        console.log(response);
        this.getEmployees();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key : string) : void {
    const results : Employee[] = [];
    for (const employee of this.employees){
      if(employee?.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee?.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee?.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee?.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }
    this.employees = results;
    if (!key){
      this.getEmployees();
    }
  }

  public onOpenModal(employee : Employee, action : string) : void {
    const container = document.getElementById("main-container");
    const button = document.createElement("button");
    button.type = "button";
    button.style.display = 'none';
    button.setAttribute("data-toggle", "modal");
    if (action === 'add'){
      button.setAttribute("data-target", '#addEmployeeModal');
    } 
    if (action === 'edit'){
      this.editEmployee = employee;
      button.setAttribute("data-target", '#updateEmployeeModal');
    } 
    if (action === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute("data-target", '#deleteEmployeeModal');
    } 
    container?.appendChild(button);
    button.click();
  }

}
