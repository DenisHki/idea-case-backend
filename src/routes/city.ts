import express, { Request, Response } from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import {
  validateCityId,
  validateCityPost,
  validateCityPut,
  validateEstablishedDate,
} from '../validationHandler/city.js';
import { validate } from '../validationHandler/index.js';

const city = express.Router();

// get all cities:
city.get('/', [validate], (req: Request, res: Response) => {
  db_knex('City')
    .select('id', 'name', 'established', 'averageTemp')
    .orderBy('name', 'asc')
    .then((data) => {
      successHandler(req, res, data, 'GetCityData succesful - City');
    })
    .catch((err) => {
      requestErrorHandler(req, res, `${err} Oops! Nothing came through - City`);
    });
});

// get city by id:
city.get('/:id', validateCityId, [validate], (req: Request, res: Response) => {
  db_knex('City')
    .select()
    .where('id', req.params.id)
    .then((data) => {
      successHandler(
        req,
        res,
        data,
        'Successfully read the department by id from database',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oh no! could not get anything from database',
      );
    });
});

// add city:
city.post('/', validateCityPost, [validate], (req: Request, res: Response) => {
  db_knex('City')
    .insert(req.body)
    .into('City')
    .then((idArray) => {
      successHandler(
        req,
        res,
        idArray,
        'Adding a city, or multiple cities was succesful',
      );
    })
    .catch((error) => {
      if (error.errno === 1062) {
        requestErrorHandler(
          req,
          res,
          `Conflict: City with the name ${req.body.name} already exists!`,
        );
      } else if (error.errno === 1054) {
        requestErrorHandler(req, res, "error in spelling in 'name'.");
      } else {
        dbErrorHandler(req, res, error, 'error adding department');
      }
    });
});

// update city
city.put('/', validateCityPut, [validate], (req: Request, res: Response) => {
  db_knex('City')
    .where('id', req.body.id)
    .update(req.body)
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(req, res, rowsAffected, 'Updated succesfully');
      } else {
        requestErrorHandler(req, res, 'Error');
      }
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, 'Error at updating department');
    });
});

// delete city by id:
city.delete(
  '/:id',
  validateCityId,
  [validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Delete succesful! Count of deleted rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(req, res, `Invalid number id: ${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error');
      });
  },
);

// get city with "burg" in their name
city.get('/search/burg', (req: Request, res: Response) => {
  db_knex('City')
    .select('id', 'name', 'established', 'averageTemp')
    .where('name', 'like', '%burg%')
    .orderBy('name', 'asc')
    .then((data) => {
      successHandler(
        req,
        res,
        data,
        "Cities containing 'burg' retrieved successfully.",
      );
    })
    .catch((err) => {
      requestErrorHandler(req, res, `${err} Oops! Could not retrieve cities.`);
    });
});

// get cities matching search text
city.post('/search', validate, (req: Request, res: Response) => {
  db_knex('City')
    .select('id', 'name', 'established', 'averageTemp')
    .where('name', 'like', `%${req.body.searchText}%`)
    .orderBy('name', 'asc')
    .then((data) => {
      successHandler(
        req,
        res,
        data,
        'Cities matching search text retrieved successfully.',
      );
    })
    .catch((err) => {
      requestErrorHandler(req, res, `${err} Oops! Could not retrieve cities.`);
    });
});

// get cities established before a certain date
city.post(
  '/established-before',
  validateEstablishedDate,
  [validate],
  (req: Request, res: Response) => {
    db_knex('City')
      .select('id', 'name', 'established', 'averageTemp')
      .where('established', '<', req.body.established)
      .orderBy('established', 'asc')
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Cities established before the specified date retrieved successfully.',
        );
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err} Oops! Could not retrieve cities.`,
        );
      });
  },
);

export default city;
