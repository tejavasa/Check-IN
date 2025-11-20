import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import {
  ClassAppointmentInfo,
  AttendanceRequestModel,
  CenterConfiguration,
  CheckInMethodConfig
} from '../../models/attendance.models';

@Component({
  selector: 'app-checkin-portal',
  templateUrl: './checkin-portal.component.html',
  styleUrls: ['./checkin-portal.component.scss']
})
export class CheckinPortalComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rfidInput') rfidInputElement!: ElementRef<HTMLInputElement>;

  view: string = 'login';
  name: string = '';
  selectedLevel: 'beginner' | 'explore' | null = null;
  checkInMethod: 'qr' | 'rfid' | 'manual' | null = null;
  studentId: string = '';
  participantId: string = '';
  selectedClass: ClassAppointmentInfo | null = null;
  availableClasses: ClassAppointmentInfo[] = [];
  isLoading: boolean = false;
  isScanning: boolean = false;
  error: string = '';
  stream: MediaStream | null = null;
  checkInTime: Date | null = null;
  rfidData: string = '';
  centerConfig: CenterConfiguration | null = null;
  availableMethods: CheckInMethodConfig[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadCenterConfiguration();
  }

  loadCenterConfiguration(): void {
    this.attendanceService.getCenterConfiguration('CENTER001').subscribe({
      next: (config) => {
        this.centerConfig = config;
        this.availableMethods = this.attendanceService.getAvailableCheckInMethods(config);

        // If level selection is not required, skip to check-in method
        if (!config.requireLevelSelection) {
          this.selectedLevel = 'beginner'; // Set a default
        }
      },
      error: (err) => {
        console.error('Error loading center configuration:', err);
        this.error = 'Failed to load center configuration';
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  handleLogin(): void {
    if (this.name.trim()) {
      if (this.centerConfig?.requireLevelSelection) {
        this.view = 'selection';
      } else {
        this.selectedLevel = 'beginner'; // Set default
        this.view = 'checkin-method';
      }
      this.error = '';
    }
  }

  handleLevelSelect(level: 'beginner' | 'explore'): void {
    this.selectedLevel = level;
    this.view = 'checkin-method';
  }

  handleMethodSelect(method: 'qr' | 'rfid' | 'manual'): void {
    this.checkInMethod = method;
    this.error = '';

    if (method === 'qr') {
      this.view = 'qr-scanner';
      setTimeout(() => this.startCamera(), 100);
    } else if (method === 'rfid') {
      this.view = 'rfid-reader';
      setTimeout(() => {
        if (this.rfidInputElement?.nativeElement) {
          this.rfidInputElement.nativeElement.focus();
        }
      }, 100);
    } else if (method === 'manual') {
      this.view = 'manual-entry';
    }
  }

  async startCamera(): Promise<void> {
    try {
      this.error = '';
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      this.error = `Camera access denied. Using demo mode instead.`;
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  captureQRCode(): void {
    const simulatedQRData = `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    this.studentId = simulatedQRData;
    this.stopCamera();
    this.processCheckIn();
  }

  simulateRFIDScan(): void {
    const simulatedRFID = `RFID-${Math.random().toString(36).substr(2, 10).toUpperCase()}`;
    this.studentId = simulatedRFID;
    this.rfidData = simulatedRFID;
    this.processCheckIn();
  }

  handleManualCheckIn(): void {
    if (this.studentId.trim()) {
      this.processCheckIn();
    } else {
      this.error = 'Please enter a valid student ID';
    }
  }

  processCheckIn(): void {
    this.isLoading = true;
    this.error = '';

    this.attendanceService.getParticipantId(this.studentId, 'FACILITY1')
      .subscribe({
        next: (participantId) => {
          if (participantId) {
            this.participantId = participantId.toString();
            this.loadClasses();
          } else {
            this.error = 'Student not found. Please check your ID.';
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.error = 'Error looking up student. Please try again.';
          this.isLoading = false;
        }
      });
  }

  loadClasses(): void {
    const offset = new Date().getTimezoneOffset();

    this.attendanceService.getAllClasses(this.participantId, 'FACILITY1', offset)
      .subscribe({
        next: (classes) => {
          this.availableClasses = classes;

          if (classes.length === 0) {
            this.error = 'No classes found for today.';
            this.isLoading = false;
          } else if (classes.length === 1) {
            this.selectedClass = classes[0];
            this.completeCheckIn();
          } else {
            this.view = 'class-selection';
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.error = 'Error loading classes. Please try again.';
          this.isLoading = false;
        }
      });
  }

  selectClass(classInfo: ClassAppointmentInfo): void {
    this.selectedClass = classInfo;
    this.completeCheckIn();
  }

  completeCheckIn(): void {
    if (!this.selectedClass) return;

    this.isScanning = true;
    this.isLoading = false;

    const request: AttendanceRequestModel = {
      region: 'US',
      companyId: this.selectedClass.company_id,
      programDate: this.selectedClass.program_date,
      classAppointmentId: this.selectedClass.class_appointment_id,
      classAppointmentTimesId: this.selectedClass.class_appointment_times_id,
      classAppointmentOccurrenceId: this.selectedClass.class_appointment_occurrence_id,
      classRegistrationDetailId: this.selectedClass.class_registration_detail_id,
      participantId: this.participantId,
      membershipId: this.selectedClass.membership_id,
      membershipOptionId: this.selectedClass.membership_option_id,
      regId: this.selectedClass.reg_id,
      classRegId: this.selectedClass.class_reg_id,
      studentId: this.selectedClass.student_id
    };

    this.attendanceService.checkIn(request).subscribe({
      next: (response) => {
        this.isScanning = false;
        if (response.isSuccess) {
          this.checkInTime = new Date();
          this.view = 'success';
          this.error = '';
        } else {
          this.error = response.errorMessage || 'Check-in failed. Please try again.';
        }
      },
      error: (err) => {
        this.isScanning = false;
        this.error = 'Check-in failed. Please try again.';
      }
    });
  }

  handleBack(): void {
    this.stopCamera();
    if (this.view === 'class-selection') {
      this.view = 'checkin-method';
    } else {
      this.view = 'checkin-method';
    }
    this.error = '';
    this.studentId = '';
  }

  handleReset(): void {
    this.stopCamera();
    this.view = 'login';
    this.name = '';
    this.selectedLevel = null;
    this.checkInMethod = null;
    this.studentId = '';
    this.participantId = '';
    this.selectedClass = null;
    this.availableClasses = [];
    this.isScanning = false;
    this.isLoading = false;
    this.error = '';
    this.checkInTime = null;
    this.rfidData = '';
    this.loadCenterConfiguration(); // Reload config on reset
  }

  isMethodAvailable(methodType: 'qr' | 'rfid' | 'manual'): boolean {
    return this.availableMethods.some(m => m.type === methodType && m.enabled);
  }

  backToSelection(): void {
    this.view = 'selection';
  }
}
