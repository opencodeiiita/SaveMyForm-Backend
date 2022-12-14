import { response_200 } from '../utils/responseCodes.js';

export function greet(req, res) {
  return response_200(res, 'Hello there!');
}
