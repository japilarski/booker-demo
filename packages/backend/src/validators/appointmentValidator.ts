import { Appointment } from '../types/appointment';
import { MissingFieldError } from '../exceptions/missingFieldError';

export class AppointmentValidator {
  public validate(appointment: Appointment): void {
    if (appointment.id == undefined) {
      throw new MissingFieldError('id');
    }
    if (appointment.clientId == undefined) {
      throw new MissingFieldError('clientId');
    }
    if (appointment.providerId == undefined) {
      throw new MissingFieldError('providerId');
    }
    if (appointment.serviceName == undefined) {
      throw new MissingFieldError('serviceName');
    }
    if (appointment.dateTime == undefined) {
      throw new MissingFieldError('dateTime');
    }
    if (appointment.duration == undefined) {
      throw new MissingFieldError('duration');
    }
  }
}
