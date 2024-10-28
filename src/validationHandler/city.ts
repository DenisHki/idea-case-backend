import { body, check } from 'express-validator';
import {
  createNameValidatorChain,
  createNumberValidatorChain,
} from './index.js';

// City specific validation chains
export const validateCityId = [...createNumberValidatorChain('id')];

export const validateCityName = [...createNameValidatorChain('name')];

// Establishment date must be a valid ISO 8601 date
export const validateEstablishedDate = [
  check('established')
    .isISO8601()
    .withMessage('Established date must be a valid date in ISO 8601 format')
    .bail()
    .notEmpty()
    .withMessage('Established date cannot be empty'),
];

// Combining validations for POST requests
export const validateCityPost = [
  ...validateCityName,
  ...validateEstablishedDate,
];

// Combining validations for PUT requests
export const validateCityPut = [...validateCityId, ...validateCityPost];

// Validation for multiple cities
export const validateCityMultiPost = [
  body('*.name').exists().withMessage('City name is required'),
  body('*.established').exists().withMessage('Established date is required'),
  body('*.averageTemp').exists().withMessage('Average temperature is required'),
];
