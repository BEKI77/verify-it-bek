import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Express } from 'express';
import { InstitutionsService } from './institutions.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { User_Role } from 'src/interfaces/user.interface';
import { UUID } from 'crypto';
import { DecoderService } from 'src/decoder/decoder.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import * as csv from 'csv-parser';
import { CertificateDataDto } from './dto/certificate-data.dto';

@Controller('institutions')
@UseGuards(RolesGuard)
@Roles(User_Role.Institute, User_Role.Admin)
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly decoderService: DecoderService
  ) {}

  @Post('issue')
  async issue(@Body() dto: CertificateDataDto , @Req() req) {
    const user = this.decoderService.decode(req);
    const result = await this.institutionsService.issueCertificate(dto, user.userId);
    return {
      success: true,
      message: 'Certificate issued successfully',
      data: result,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req){
    const user = this.decoderService.decode(req);
    const results: CertificateDataDto [] = [];

    const stream = Readable.from(file.buffer); 

    await new Promise<void>((resolve, reject) => {
      stream
      .pipe(csv())
      .on('data', (data) => {
        try{
          const certificate: CertificateDataDto = {
            fullName: data.fullName,
            degree: data.degree,
            fieldOfStudy: data.fieldOfStudy,
            issuedAt: data.issuedAt,
            cgpa: data.cgpa
          }
          
          results.push(certificate);

        } catch(error)  {
            console.error("Error parsing row:  ", data, error);
        }
      })
      .on('end' , resolve)
      .on('error', reject);
    });

    return {
      success: true,
      message: 'CSV file processed and certificate uploads successfully',
    };
  }

  @Get('info')
  async getInstituteInfo(@Req() req) {
    const result = await this.institutionsService.getInfo(req);
    return {
      success: true,
      message: 'Institute information retrieved successfully',
      data: result,
    };
  }

  @Get('certificates')
  async listCertificates(@Req() req) {
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