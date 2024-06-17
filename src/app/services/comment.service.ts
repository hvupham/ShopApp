import { InsertCommentDTO } from './../dtos/comment/insert.comment.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAllcommentsByProduct(productId: number): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/comments/${productId}`);
  }

  insertComment(insertCommentDTO:InsertCommentDTO):Observable<ApiResponse>{

    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/comments`, insertCommentDTO);
  }

}
