import rateLimit from 'express-rate-limit';

export const authLimit=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-7',legacyHeaders:false});
