import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/roles/roles.guard';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @UseGuards(RolesGuard)
  @Roles(User_Role.Institute)
  @Post('/institute/issue')
  @Post('issue')
  async issueCertificate(@Body() dto: CreateCertificateDto) {
    return this.certificateService.createCertificate(dto);
  }
}
