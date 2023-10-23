import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  LoggerService,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApproveLoanDto } from './dto/approve.loan.dto';
import { CommonApiResponse, parseNumber } from 'src/shared/response/utilities';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/loan/dto/loan.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard('api-key'))
  @ApiTags('Admin')
  @Put('approve')
  async approveLoan(
    @Body() loanDto: ApproveLoanDto,
  ): Promise<CommonApiResponse> {
    try {
      const data = await this.adminService.approveLoan(loanDto);
      let res = null;
      if (data == 0) {
        res = new CommonApiResponse(
          HttpStatus.OK,
          'Successful updated status of loan',
          null,
        );
      } else if (data == 1) {
        res = new CommonApiResponse(
          HttpStatus.BAD_REQUEST,
          'Loan status is already updated by admin',
          { laon_id: loanDto.loan_id },
        );
      } else if (data == 2) {
        res = new CommonApiResponse(
          HttpStatus.BAD_REQUEST,
          'Loan with specific id does not exist',
          { laon_id: loanDto.loan_id },
        );
      }
      return res;
    } catch (err) {
      this.logger.error('Error while creatign a user', {
        error: err,
        data: loanDto,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }

  @UseGuards(AuthGuard('api-key'))
  @ApiTags('Admin')
  @Get('find')
  async getAll(@Query() queryParam: PaginationDto): Promise<CommonApiResponse> {
    try {
      queryParam.page = parseNumber(queryParam.page, 1);
      queryParam.limit = parseNumber(queryParam.limit, 100);
      if (queryParam.limit < 1 || queryParam.limit > 100) {
        queryParam.limit = 100; // Max in a page
      }
      if (queryParam.page < 1) {
        queryParam.page = 1; // Max in a page
      }
      const loanData = await this.adminService.find(
        queryParam.page,
        queryParam.limit,
      );
      return new CommonApiResponse(HttpStatus.OK, 'Loans', loanData);
    } catch (err) {
      this.logger.error('Error while fetching loans', {
        error: err,
        data: null,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }

  @UseGuards(AuthGuard('api-key'))
  @ApiTags('Admin')
  @Get('find/:loan_id')
  async get(@Param('loan_id') id: string): Promise<CommonApiResponse> {
    try {
      const loanData = await this.adminService.loanDetails(id);
      return new CommonApiResponse(HttpStatus.OK, 'Loan', loanData);
    } catch (err) {
      this.logger.error('Error while fetching loan', {
        error: err,
        data: null,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }
}
