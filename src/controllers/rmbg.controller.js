import { removeBg } from '../services/rmbackground.service.js';
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

export const rmbg = catchAsync(async (req, res) => {
  // Logic for rmbg if implemented
  successResponse(res, {}, 'RMBG endpoint (logic not fully implemented)');
});
