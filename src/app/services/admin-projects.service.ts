import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Project } from "../models/projects.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class AdminProjectService {
    private apiUrl = "http://localhost:3000/api/projects";

    constructor(private http: HttpClient) {}

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.apiUrl);
    }

    addProject(project: Project): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, project);
    }
}