import { Router } from 'express';
import { authenticate } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

// Inquiries (RFQ)
router.post('/inquiries', authenticate, ctrl.createInquiry);
router.get('/inquiries/my', authenticate, ctrl.listMyInquiries);
router.get('/inquiries/received', authenticate, ctrl.listReceivedInquiries);
router.patch('/inquiries/:id/status', authenticate, ctrl.updateInquiryStatus);

// Quotes
router.post('/quotes', authenticate, ctrl.createQuote);
router.get('/inquiries/:inquiryId/quotes', authenticate, ctrl.getQuotes);

// Messages
router.get('/messages/:inquiryId', authenticate, ctrl.getMessages);
router.post('/messages/:inquiryId', authenticate, ctrl.sendMessage);

export default router;
