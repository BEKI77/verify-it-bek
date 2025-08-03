import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateCertificateDto } from 'src/certificate/dto/create-certificate.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';
import { UUID } from 'crypto';
import { DecoderService } from 'src/decoder/decoder.service';

@Controller('institutions')
@UseGuards(RolesGuard)
@Roles(User_Role.Institute, User_Role.Admin)
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly decoderService: DecoderService
  ) {}

  @Post('issue')
  async issue(@Body() dto: CreateCertificateDto, @Req() req) {
    const user = this.decoderService.decode(req);
    const result = await this.institutionsService.issueCertificate(dto, user.userId);
    return {
      success: true,
      message: 'Certificate issued successfully',
      data: result,
    };
  }

  @Get('/info')
  async getInstituteInfo(@Req() req) {
    console.log('getInstituteInfo called');
    const result = await this.institutionsService.getInfo(req);
    return {
      success: true,
      message: 'Institute information retrieved successfully',
      data: result,
    };
  }

  @Get('/certificates')
  async listCertificates(@Req() req) {
    console.log('listCertificates called');
    const user = this.decoderService.decode(req);
    const result = await this.institutionsService.getMyCertificates(user.userId);
    return {
      success: true,
      message: 'Certificates retrieved successfully',
      data: result,
    };
  }

  @Patch('revoke/:id')
  async revoke(@Param('id') id: UUID, @Req() req) {
    const user = this.decoderService.decode(req);
    const result = await this.institutionsService.revokeCertificate(id, user.userId);
    return {
      success: true,
      message: 'Certificate revoked successfully',
      data: result,
    };
  }
}