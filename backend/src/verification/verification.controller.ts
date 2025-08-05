import {
  Controller,
  Query,
  Get,
  Res,
  HttpStatus,
  Ip
} from '@nestjs/common';
import { Response } from 'express';
import { VerificationService } from './verification.service';

@Controller('verify')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService
  ) {}

  @Get()
  async verify(
    @Query('certificateId') certificateId: string, 
    @Res() res: Response,
    @Ip() clientIp: string
  ) {
    if (!certificateId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Missing certificateId parameter',
        data: null,
      });
    }

    try {
      const result = await this.verificationService.verifyCertificateById(certificateId);

      await this.verificationService.logVerification({
        certificateId,
        verifiedByIp: clientIp,
        status: result.valid? 'valid' : 'invalid',
        notes: result.reason || null
      })

      if (!result.valid) {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: result.reason,
          data: null,
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Certificate is valid',
        data: result.certificate,
      });
    } catch (error) {

      await this.verificationService.logVerification({
        certificateId,
        verifiedByIp: clientIp,
        status: 'invalid',
        notes: error.message || 'Certificate not found',
      })
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || 'Certificate not found',
        data: null,
      });
    }
  }
}
