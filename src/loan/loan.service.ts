import { Injectable } from '@nestjs/common';
import { Loan, LoanStatus } from 'src/postgres/entity/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emi } from 'src/postgres/entity/emi.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Emi)
    private readonly emiRepository: Repository<Emi>,
  ) {}

  async createNewLoan(
    loanCreateReq: CreateLoanDto,
    username: string,
  ): Promise<Loan> {
    const loan = new Loan();
    loan.user_id = username;
    loan.amount = loanCreateReq.amount;
    loan.periodicity = loanCreateReq.periodicity;
    loan.description = loanCreateReq.description;
    loan.status = LoanStatus.PENDING;
    loan.total_emis = loanCreateReq.total_emis;
    loan.remaining_emis = loan.total_emis;
    loan.emi_amount = Number(loan.amount / loan.total_emis);
    const data = await this.loanRepository.save(loan);
    return data;
  }

  async cancelLoan(loan_id: string, username: string): Promise<number> {
    const data = await this.loanRepository.findOne({
      where: {
        id: loan_id,
        user_id: username,
      },
    });
    if (data) {
      if (data.status == LoanStatus.PENDING) {
        data.status = LoanStatus.CANCELLED;
        await this.loanRepository.update({ id: loan_id }, data);
        return 0;
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  }

  async loanDetails(username: string, loan_id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id: loan_id, user_id: username },
    });

    if (loan) {
      const emis = await this.emiRepository.find({
        where: { loan_id: loan_id },
      });
      const res = Object.create(loan);
      res.emis = emis;
      return res;
    } else {
      return null;
    }
  }

  async find(
    username: string,
    page: number,
    per_page: number,
  ): Promise<{
    results: Loan[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const [result, total] = await this.loanRepository.findAndCount({
      where: { user_id: username },
      order: { updated_at: 'DESC' },
      take: per_page,
      skip: (page - 1) * per_page,
    });
    return {
      results: result,
      total: total,
      page: page,
      per_page: per_page,
    };
  }
}
