import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Project } from '../../models/projects.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  projectForm!: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      tags: this.fb.array([this.fb.control('')]),
      description: this.fb.array([this.fb.control('')]),
      technologies: this.fb.array([this.fb.control('')]),
      imageUrl: this.fb.group({
        grid: ['', Validators.required],
        list: ['', Validators.required]
      }),
      link: ['', Validators.required]
    });
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

  // Methods to add new form controls to arrays
  addTag(): void {
    this.tagsArray.push(this.fb.control(''));
  }

  addDescription(): void {
    this.descriptionArray.push(this.fb.control(''));
  }

  addTechnology(): void {
    this.technologiesArray.push(this.fb.control(''));
  }

  // Methods to remove form controls from arrays
  removeTag(index: number): void {
    this.tagsArray.removeAt(index);
  }

  removeDescription(index: number): void {
    this.descriptionArray.removeAt(index);
  }

  removeTechnology(index: number): void {
    this.technologiesArray.removeAt(index);
  }

  onSubmit(): void {
    return;
  }
}