import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export abstract class BaseTrackingEntity {
  /**
   *
   */
  constructor() {
    this.createdBy = '-';
    this.createdOn = new Date();

    this.editedBy = '-';
    this.editedOn = new Date();
    this.status = 0;
  }

  @Column()
  @ApiProperty()
  createdBy?: string;

  @Column()
  @ApiProperty()
  createdOn?: Date;

  @Column()
  @ApiProperty()
  editedBy: string;

  @Column()
  @ApiProperty()
  editedOn?: Date;

  @Column()
  @ApiProperty()
  status: RecordStatus;
}

export enum RecordStatus {
  Deleted = -20,
  InActive = -10,
  Active = 0,
}
