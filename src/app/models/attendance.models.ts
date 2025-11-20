export interface AttendanceRequestModel {
  region: string;
  companyId: string;
  programDate: string;
  classAppointmentId: string;
  classAppointmentTimesId: string;
  classAppointmentOccurrenceId: string;
  classRegistrationDetailId: string;
  participantId: string;
  membershipId: string;
  membershipOptionId: string;
  regId: string;
  classRegId: string;
  studentId: string;
}

export interface MyStudioDataResponse {
  status: string;
  posPushedVersion: number;
  msg: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  errorMessage?: string;
}

export interface ClassAppointmentInfo {
  id?: number;
  internal_id?: string;
  company_id: string;
  class_appointment_title: string;
  class_appointment_subtitle: string;
  start_time: string;
  end_time: string;
  program_date: string;
  class_appointment_id: string;
  class_appointment_times_id: string;
  class_appointment_occurrence_id: string;
  class_registration_detail_id: string;
  participant_id: string;
  membership_id: string;
  membership_option_id: string;
  membership_category_title: string;
  reg_id: string;
  class_reg_id: string;
  reg_id_type?: string;
  student_id: string;
  checked_in: boolean;
}

export interface ActiveMemberships {
  membership_title: string;
  membership_category_title: string;
}

export type CheckInMethodType = 'qr' | 'rfid' | 'manual';

export interface CenterConfiguration {
  centerId: string;
  centerName: string;
  primaryCheckInMethod: 'qr' | 'rfid'; // Must choose one - cannot be both
  allowManualEntry: boolean;
  requireLevelSelection: boolean;
}

export interface CheckInMethodConfig {
  type: CheckInMethodType;
  enabled: boolean;
  label: string;
  description: string;
}
