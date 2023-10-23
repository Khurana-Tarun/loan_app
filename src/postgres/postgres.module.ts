import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entity/loan.entity';
import { Emi } from './entity/emi.entity';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Emi, User])],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
