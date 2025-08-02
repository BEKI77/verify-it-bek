import { Controller, Get, Post, Body, Req,Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/roles/roles.guard';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}
R
  @UseGuards(RolesGuard)
  @Roles(User_Role.Institute)
  @Post('/institute/issue')
  @Post('issue')
  async issueCertificate(@Body() dto: CreateCertificateDto) {
    return this.certificateService.createCertificate(dto);
  }
}
