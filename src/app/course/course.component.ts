import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';
import {Lesson} from '../shared/model/lesson';
import {CoursesHttpService} from '../services/courses-http.service';
import {Course} from '../shared/model/course';
import {LessonsPagerService} from '../services/lessons-pager.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  providers: [
    LessonsPagerService
  ]
})
export class CourseComponent implements OnInit, OnDestroy {

  @Input()
  id: number;

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  page$: Observable<number>;
  success$: Observable<boolean>;
  errorMessage: Observable<string>;

  constructor(
    private coursesService: CoursesHttpService,
    private lessonsPagerService: LessonsPagerService
  ) {
  }

  ngOnInit() {
    this.course$ = this.coursesService.findCourseById(this.id);
    this.lessons$ = this.lessonsPagerService.lessonsPage$;

    this.lessonsPagerService.loadFirstPage(this.id);
    this.page$ = this.lessonsPagerService.currentPage$;

    this.success$ = this.lessonsPagerService.fetchStatus$;
    this.errorMessage = this.lessonsPagerService.errorMessage$;
  }


  ngOnDestroy() {
    console.log('destroying CourseComponent ...');
  }

  nextLessonsPage(): void {
    this.lessonsPagerService.nextLessonPage();
  }

  previousLessonsPage(): void {
    this.lessonsPagerService.previousLessonPage();
  }

}








