import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import {
  AttendanceRequestModel,
  ApiResponse,
  MyStudioDataResponse,
  ClassAppointmentInfo,
  ActiveMemberships
} from '../models/attendance.models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'https://localhost:5001/api'; // Update with your API URL

  constructor(private http: HttpClient) {}

  // Mock data for demo
  private mockClasses: ClassAppointmentInfo[] = [
    {
      id: 1,
      company_id: 'COMP123',
      class_appointment_title: 'JavaScript Fundamentals',
      class_appointment_subtitle: 'Introduction to Programming',
      start_time: '10:00 AM',
      end_time: '11:30 AM',
      program_date: new Date().toISOString().split('T')[0],
      class_appointment_id: 'CLASS1',
      class_appointment_times_id: 'TIME1',
      class_appointment_occurrence_id: 'OCC1',
      class_registration_detail_id: 'REG1',
      participant_id: '12345',
      membership_id: 'MEM1',
      membership_option_id: 'OPT1',
      membership_category_title: 'Standard',
      reg_id: 'REGID1',
      class_reg_id: 'CLASSREG1',
      student_id: 'STU12345',
      checked_in: false
    },
    {
      id: 2,
      company_id: 'COMP123',
      class_appointment_title: 'Python Basics',
      class_appointment_subtitle: 'Getting Started with Python',
      start_time: '2:00 PM',
      end_time: '3:30 PM',
      program_date: new Date().toISOString().split('T')[0],
      class_appointment_id: 'CLASS2',
      class_appointment_times_id: 'TIME2',
      class_appointment_occurrence_id: 'OCC2',
      class_registration_detail_id: 'REG2',
      participant_id: '12345',
      membership_id: 'MEM1',
      membership_option_id: 'OPT1',
      membership_category_title: 'Standard',
      reg_id: 'REGID2',
      class_reg_id: 'CLASSREG2',
      student_id: 'STU12345',
      checked_in: false
    },
    {
      id: 3,
      company_id: 'COMP123',
      class_appointment_title: 'Web Development',
      class_appointment_subtitle: 'HTML, CSS & JavaScript',
      start_time: '4:00 PM',
      end_time: '5:30 PM',
      program_date: new Date().toISOString().split('T')[0],
      class_appointment_id: 'CLASS3',
      class_appointment_times_id: 'TIME3',
      class_appointment_occurrence_id: 'OCC3',
      class_registration_detail_id: 'REG3',
      participant_id: '12345',
      membership_id: 'MEM1',
      membership_option_id: 'OPT1',
      membership_category_title: 'Standard',
      reg_id: 'REGID3',
      class_reg_id: 'CLASSREG3',
      student_id: 'STU12345',
      checked_in: false
    }
  ];

  getParticipantId(username: string, facilityId: string): Observable<number | null> {
    // For demo, return mock participant ID
    return of(12345).pipe(delay(500));

    // For production, uncomment:
    // return this.http.get<number>(`${this.apiUrl}/attendance/participant/${username}/${facilityId}`);
  }

  getAllClasses(participantId: string, facilityId: string, offset: number): Observable<ClassAppointmentInfo[]> {
    // For demo, return mock classes
    return of(this.mockClasses).pipe(delay(600));

    // For production, uncomment:
    // return this.http.get<ClassAppointmentInfo[]>(
    //   `${this.apiUrl}/attendance/classes/${participantId}/${facilityId}/${offset}`
    // );
  }

  getActiveMemberships(participantId: string): Observable<ActiveMemberships[]> {
    return this.http.get<ActiveMemberships[]>(
      `${this.apiUrl}/attendance/memberships/${participantId}`
    ).pipe(
      catchError(() => of([]))
    );
  }

  checkIn(request: AttendanceRequestModel): Observable<ApiResponse<MyStudioDataResponse>> {
    // For demo, return mock success
    return of({
      isSuccess: true,
      data: {
        status: 'Success',
        posPushedVersion: 1,
        msg: 'Check-in successful'
      }
    }).pipe(delay(1000));

    // For production, uncomment:
    // return this.http.post<ApiResponse<MyStudioDataResponse>>(
    //   `${this.apiUrl}/attendance/checkin`,
    //   request
    // );
  }

  checkOut(request: AttendanceRequestModel): Observable<ApiResponse<MyStudioDataResponse>> {
    return this.http.post<ApiResponse<MyStudioDataResponse>>(
      `${this.apiUrl}/attendance/checkout`,
      request
    );
  }
}
