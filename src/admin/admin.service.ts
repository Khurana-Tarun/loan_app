import { Injectable } from '@nestjs/common';
import { Loan, LoanStatus } from 'src/postgres/entity/loan.entity';
import { Repository } from 'typeorm';
import { ApproveLoanDto } from './dto/approve.loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Emi } from 'src/postgres/entity/emi.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Emi)
    private readonly emiRepository: Repository<Emi>,
  ) { }

  async approveLoan(approveLoan: ApproveLoanDto): Promise<number> {
    const loan = await this.findLoan(approveLoan.loan_id);
    if (loan) {
      if (loan.status == LoanStatus.PENDING) {
        loan.status = approveLoan.status;
        loan.admin_comments = approveLoan.comment;
        loan.approval_date = new Date().toDateString();
        if (loan.status != LoanStatus.REJECTED) {
          const emis = [];
          for (let i = 1; i <= loan.total_emis; i++) {
            const emi = new Emi();
            emi.loan_id = loan.id;
            emi.amount = loan.amount / loan.total_emis;
            const date = new Date();
            date.setDate(new Date().getDate() + i * 7);
            emi.payment_date = date.toDateString();
            emi.status = 'PENDING';
            emi.sequence = i;
            emis.push(emi);
          }
          await this.emiRepository.save(emis);
        }
        loan.transactional_logs.push(new Date().valueOf() + ":" + loan.status + " Loan status has been updated" );
        await this.loanRepository.update({ id: approveLoan.loan_id }, loan);
        return 0;
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  }

  async findLoan(loan_id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id: loan_id },
    });
    return loan;
  }

  async loanDetails(loanId: string): Promise<any> {
    const loan = await this.loanRepository.findOne({
      where: { id: loanId },
    });
    if (loan) {
      if (['PENDING', 'CANCELLED', 'REJECTED'].includes(loan.status)) {
        return loan;
      } else {
        const emis = await this.emiRepository.find({
          where: { loan_id: loanId },
        });
        const res = {
          emis: emis,
          created_at: loan.created_at,
          updated_at: loan.updated_at,
          id: loan.id,
          amount: loan.amount,
          remaining_amount: loan.remaining_amount,
          user_id: loan.user_id,
          periodicity: loan.periodicity,
          total_emis: loan.total_emis,
          remaining_emis: loan.remaining_emis,
          description: loan.description,
          admin_comments: loan.admin_comments,
          approval_date: loan.approval_date,
          status: loan.status,
          transactional_logs :loan.transactional_logs
        }
        return res;
      }
    } else {
      return null;
    }
  }

  async find(
    page: number,
    per_page: number,
  ): Promise<{
    results: Loan[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const [result, total] = await this.loanRepository.findAndCount({
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
