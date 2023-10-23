import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from 'src/postgres/entity/loan.entity';
import { Emi } from 'src/postgres/entity/emi.entity';
import { PassportModule } from '@nestjs/passport';
import { HeaderApiKeyStrategy } from './auth.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Loan, Emi])],
  controllers: [AdminController],
  providers: [AdminService, HeaderApiKeyStrategy],
})
export class AdminModule {}
