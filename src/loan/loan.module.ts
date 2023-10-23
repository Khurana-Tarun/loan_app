import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from 'src/postgres/entity/loan.entity';
import { Emi } from 'src/postgres/entity/emi.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan, Emi]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          global: true,
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2 days' },
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
