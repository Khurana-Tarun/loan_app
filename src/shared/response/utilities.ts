import { HttpStatus } from '@nestjs/common';

export class CommonApiResponse {
  status: HttpStatus;
  message: string = '';
  data: any;
  constructor(status: HttpStatus, messsage: string, data: any) {
    this.status = status;
    this.message = messsage;
    this.data = data;
  }
}

export function parseNumber(data: any, defaultValue: number) {
  try {
    return isNaN(data) ? defaultValue : parseInt(data);
  } catch (err) {
    return defaultValue;
  }
}
