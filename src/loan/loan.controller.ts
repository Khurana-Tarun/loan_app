import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  LoggerService,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommonApiResponse, parseNumber } from 'src/shared/response/utilities';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanService } from './loan.service';
import { AuthGuard } from 'src/user/auth-guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PaginationDto } from './dto/loan.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('loan')
export class LoanController {
  constructor(
    private loanService: LoanService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiTags('loan')
  @Post('apply')
  async createLoan(
    @Body() loan: CreateLoanDto,
    @Request() req: any,
  ): Promise<CommonApiResponse> {
    try {
      const loanData = await this.loanService.createNewLoan(
        loan,
        req.user.username,
      );
      return new CommonApiResponse(
        HttpStatus.OK,
        'Successful created loan request',
        { loan_id: loanData.id },
      );
    } catch (err) {
      this.logger.error('Error while creatign a user', {
        error: err,
        data: loan,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }

  @UseGuards(AuthGuard)
  @ApiTags('loan')
  @Put('cancel/:loan_id')
  async cancelLoan(
    @Param('loan_id') id: string,
    @Request() req: any,
  ): Promise<CommonApiResponse> {
    try {
      const data = await this.loanService.cancelLoan(id, req.user.username);
      let res = null;
      if (data == 0) {
        res = new CommonApiResponse(HttpStatus.OK, 'Successful cancelled', {
          laon_id: id,
        });
      } else if (data == 1) {
        res = new CommonApiResponse(
          HttpStatus.BAD_REQUEST,
          'Loan is already in progress',
          { laon_id: id },
        );
      } else if (data == 2) {
        res = new CommonApiResponse(
          HttpStatus.BAD_REQUEST,
          'Loan with specific id does not exist',
          { laon_id: id },
        );
      }
      return res;
    } catch (err) {
      this.logger.error('Error while creatign a user', {
        error: err,
        data: id,
      });
      return new CommonApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error while processing the request',
        null,
      );
    }
  }

  @UseGuards(AuthGuard)
  @ApiTags('loan')
  @Get('find')
  async get(
    @Query() queryParam: PaginationDto,
    @Request() req: any,
  ): Promise<CommonApiResponse> {
    try {
      queryParam.page = parseNumber(queryParam.page, 1);
      queryParam.limit = parseNumber(queryParam.limit, 100);
      if (queryParam.limit < 1 || queryParam.limit > 100) {
        queryParam.limit = 100; // Max in a page
      }
      if (queryParam.page < 1) {
        queryParam.page = 1; // Max in a page
      }
      const loanData = await this.loanService.find(
        req.user.username,
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

  @UseGuards(AuthGuard)
  @ApiTags('loan')
  @Get('find/:loan_id')
  async getloan(
    @Param('loan_id') id: string,
    @Request() req: any,
  ): Promise<CommonApiResponse> {
    try {
      const loanData = await this.loanService.loanDetails(
        req.user.username,
        id,
      );
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
