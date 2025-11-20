import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import {
  AttendanceRequestModel,
  ApiResponse,
  MyStudioDataResponse,
  ClassAppointmentInfo,
  ActiveMemberships,
  CenterConfiguration,
  CheckInMethodConfig
} from '../models/attendance.models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'https://localhost:5001/api'; // Update with your API URL

  constructor(private http: HttpClient) {}

  // ==================== CENTER CONFIGURATION EXAMPLES ====================
  // Choose ONE of the example configurations below based on your center's needs
  // In production, this would come from your API backend

  // EXAMPLE 1: QR Code Only Center (No RFID)
  // Uncomment this configuration to use QR code scanning only
  // private mockCenterConfig: CenterConfiguration = {
  //   centerId: 'CENTER001',
  //   centerName: 'QR Code Center',
  //   primaryCheckInMethod: 'qr',      // QR code scanning only
  //   allowManualEntry: false,          // No manual entry - QR only
  //   requireLevelSelection: true       // Students select beginner/explore
  // };

  // EXAMPLE 2: QR Code + Manual Entry Center
  // Uncomment this configuration to allow QR scanning with manual fallback
  // private mockCenterConfig: CenterConfiguration = {
  //   centerId: 'CENTER002',
  //   centerName: 'QR + Manual Center',
  //   primaryCheckInMethod: 'qr',      // QR code as primary method
  //   allowManualEntry: true,           // Allow manual ID entry as backup
  //   requireLevelSelection: true       // Students select beginner/explore
  // };

  // EXAMPLE 3: RFID Only Center (No QR Code)
  // Uncomment this configuration to use RFID card scanning only
  // private mockCenterConfig: CenterConfiguration = {
  //   centerId: 'CENTER003',
  //   centerName: 'RFID Card Center',
  //   primaryCheckInMethod: 'rfid',    // RFID card scanning only
  //   allowManualEntry: false,          // No manual entry - RFID only
  //   requireLevelSelection: true       // Students select beginner/explore
  // };

  // EXAMPLE 4: RFID + Manual Entry Center
  // Uncomment this configuration to allow RFID with manual fallback
  // private mockCenterConfig: CenterConfiguration = {
  //   centerId: 'CENTER004',
  //   centerName: 'RFID + Manual Center',
  //   primaryCheckInMethod: 'rfid',    // RFID as primary method
  //   allowManualEntry: true,           // Allow manual ID entry as backup
  //   requireLevelSelection: false      // Skip level selection, go straight to check-in
  // };

  // ACTIVE CONFIGURATION (Currently Using Example 2: QR + Manual)
  private mockCenterConfig: CenterConfiguration = {
    centerId: 'CENTER002',
    centerName: 'QR + Manual Center',
    primaryCheckInMethod: 'qr',        // QR code as primary method
    allowManualEntry: true,             // Allow manual ID entry as backup
    requireLevelSelection: true         // Students select beginner/explore
  };

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

  getCenterConfiguration(centerId: string): Observable<CenterConfiguration> {
    // For demo, return mock configuration
    return of(this.mockCenterConfig).pipe(delay(300));

    // For production, uncomment:
    // return this.http.get<CenterConfiguration>(`${this.apiUrl}/centers/${centerId}/configuration`);
  }

  getAvailableCheckInMethods(config: CenterConfiguration): CheckInMethodConfig[] {
    const methods: CheckInMethodConfig[] = [];

    // Add the primary method (QR or RFID - mutually exclusive)
    if (config.primaryCheckInMethod === 'qr') {
      methods.push({
        type: 'qr',
        enabled: true,
        label: 'QR Code',
        description: 'Scan with camera'
      });
    } else if (config.primaryCheckInMethod === 'rfid') {
      methods.push({
        type: 'rfid',
        enabled: true,
        label: 'RFID',
        description: 'Tap your RFID card'
      });
    }

    // Optionally add manual entry
    if (config.allowManualEntry) {
      methods.push({
        type: 'manual',
        enabled: true,
        label: 'Manual Check-In',
        description: 'Enter student ID'
      });
    }

    return methods;
  }
}
