import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [AdminProjectService],
})
export class AdminComponent implements OnInit {
  projectForm!: FormGroup;
  submitted = false;
  success = false;
  error = '';

  gridImageFile: File | null = null;
  listImageFile: File | null = null;

  gridImagePreview: string | ArrayBuffer | null = null;
  listImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private adminProjectService: AdminProjectService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.adminProjectService.getProjects().subscribe(
      (projects) => projects,
      (error) => console.error('Error fetching projects:', error)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      tags: this.fb.array([this.fb.control('')]),
      description: this.fb.array([this.fb.control('')]),
      technologies: this.fb.array([this.fb.control('')]),
      imageUrl: this.fb.group({
        grid: [''],
        list: [''],
      }),
      link: ['', Validators.required],
    });
  }

  onImageSelected(imageType: 'grid' | 'list', event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (imageType === 'grid') {
        this.gridImageFile = file;
      } else {
        this.listImageFile = file;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        if (imageType === 'grid') {
          this.gridImagePreview = reader.result;
        } else {
          this.listImagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);

      const filename = file.name;
      this.projectForm.get('imageUrl')?.get(imageType)?.setValue(filename);
    }
  }

  onGridImageSelected(event: any): void {
    this.onImageSelected('grid', event);
  }

  onListImageSelected(event: any): void {
    this.onImageSelected('list', event);
  }

  // Helper getters for form arrays
  get tagsArray(): FormArray {
    return this.projectForm.get('tags') as FormArray;
  }

  get descriptionArray(): FormArray {
    return this.projectForm.get('description') as FormArray;
  }

  get technologiesArray(): FormArray {
    return this.projectForm.get('technologies') as FormArray;
  }

  getFormArray(name: string): FormArray {
    return this.projectForm.get(name) as FormArray;
  }

  addFormArrayItem(arrayName: string): void {
    const formArray = this.getFormArray(arrayName);
    formArray.push(this.fb.control(''));
  }

  removeFormArrayItem(arrayName: string, index: number): void {
    const formArray = this.getFormArray(arrayName);
    formArray.removeAt(index);
  }

  addTag(): void {
    this.addFormArrayItem('tags');
  }

  addDescription(): void {
    this.addFormArrayItem('description');
  }

  addTechnology(): void {
    this.addFormArrayItem('technologies');
  }

  removeTag(index: number): void {
    this.removeFormArrayItem('tags', index);
  }

  removeDescription(index: number): void {
    this.removeFormArrayItem('description', index);
  }

  removeTechnology(index: number): void {
    this.removeFormArrayItem('technologies', index);
  }

  resetForm(): void {
    this.projectForm.reset();
    this.initForm();
    this.gridImageFile = null;
    this.listImageFile = null;
    this.gridImagePreview = null;
    this.listImagePreview = null;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.projectForm.invalid) {
      return;
    }
    const projectData = this.projectForm.value;

    this.adminProjectService
      .addProject(projectData, this.gridImageFile, this.listImageFile)
      .subscribe(
        (response) => {
          console.log('Project added successfully', response);
          this.success = true;
          this.submitted = false;
          this.resetForm();
        },
        (error) => {
          console.error('Error adding project:', error);
          this.error =
            'Failed to add project: ' + (error.message || 'Unknown error');
          this.submitted = false;
        }
      );
  }
}
