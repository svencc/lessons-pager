import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Lesson} from '../shared/model/lesson';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LessonsPagerService {

  private static PAGE_SIZE = 2;

  private lessonsPage = new BehaviorSubject<Lesson[]>([]);
  lessonsPage$: Observable<Lesson[]> = this.lessonsPage.asObservable();

  private page = new BehaviorSubject<number>(1);
  currentPage$ = this.page.asObservable();

  private pageSize = new BehaviorSubject<number>(LessonsPagerService.PAGE_SIZE);
  pageSize$ = this.pageSize.asObservable();

  private courseId = new BehaviorSubject<number>(1);
  courseId$ = this.courseId.asObservable();


  private fetchStatus = new BehaviorSubject<boolean>(true);
  fetchStatus$ = this.fetchStatus.asObservable();

  private errorMessage = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessage .asObservable();



  constructor(private httpClient: HttpClient) {
  }

  loadFirstPage(courseId: number) {
    this.courseId.next(courseId);
    this.page.next(1);
    // this.pageSize.next(LessonsPagerService.PAGE_SIZE);
    this.fetchData();
  }

  nextLessonPage() {
    this.page.next(this.page.getValue() + 1);
    this.fetchData();
  }

  previousLessonPage() {
    if ( this.page.getValue() > 1) {
      this.page.next(this.page.getValue() - 1);
      this.fetchData();
    }
  }

  private fetchData(): void {
    let params = new HttpParams();
    params = params.append('courseId', this.courseId.getValue().toString());
    params = params.append('pageNumber', this.page.getValue().toString());
    params = params.append('pageSize', this.pageSize.getValue().toString());

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const httpClient = this.httpClient.get<{payload: Lesson[]}>(`/api/lessons`, {
      headers: headers,
      params: params
    });

    httpClient.subscribe(
      (response: {payload: Lesson[]}) => {
        this.lessonsPage.next(response.payload);
        this.setSuccess(true);
      },
      (err) => {
        this.setSuccess(false);
      }
    );
  }

  private setSuccess(isSuccessful: boolean, statusMessage = 'Fetching the data was not successful! Check your connection'): void {
    if (isSuccessful) {
      this.fetchStatus.next(true);
      this.errorMessage.next(statusMessage);
    } else {
      this.fetchStatus.next(false);
      this.errorMessage.next('');
    }
  }

}
