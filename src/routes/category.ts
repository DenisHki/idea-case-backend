import express, { Request, Response } from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';

const category = express.Router();

// get all categories
category.get('/', (req: Request, res: Response) => {
  db_knex('Category')
    .select('id', 'name', 'description', 'budgetLimit', 'isActive')
    .orderBy('name', 'asc')
    .then((data) => {
      const transformedData = data.map((item) => ({
        ...item,
        isActive: item.isActive === 1,
      }));
      successHandler(
        req,
        res,
        transformedData,
        'GetCatData successful - Category',
      );
    })
    .catch((err) => {
      requestErrorHandler(
        req,
        res,
        `${err} Oops! Nothing came through - Category`,
      );
    });
});

// get category by id
category.get('/:id', (req: Request, res: Response) => {
  db_knex('Category')
    .select()
    .where('id', req.params.id)
    .then((data) => {
      const transformedData = data.map((item) => ({
        ...item,
        isActive: item.isActive === 1,
      }));
      successHandler(
        req,
        res,
        transformedData,
        'Successfully read the category by id from database',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oh no! could not get anything from the database',
      );
    });
});

// add category
category.post('/', (req: Request, res: Response) => {
  db_knex('Category')
    .insert(req.body)
    .into('Category')
    .then((idArray) => {
      successHandler(
        req,
        res,
        idArray,
        'Adding a department, or multiple departments was successful',
      );
    })
    .catch((error) => {
      if (error.errno === 1062) {
        requestErrorHandler(
          req,
          res,
          `Conflict: Category with the name ${req.body.name} already exists!`,
        );
      } else if (error.errno === 1054) {
        requestErrorHandler(
          req,
          res,
          "Error in spelling [either in 'name' and/or in 'description'].",
        );
      } else {
        dbErrorHandler(req, res, error, 'Error adding department');
      }
    });
});

// update department by id
category.put('/', (req: Request, res: Response) => {
  db_knex('Category')
    .where('id', req.body.id)
    .update(req.body)
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(req, res, rowsAffected, 'Updated successfully');
      } else {
        requestErrorHandler(req, res, 'Error');
      }
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, 'Error at updating category');
    });
});

// delete category by id
category.delete('/:id', (req: Request, res: Response) => {
  db_knex('Category')
    .where('id', req.params.id)
    .del()
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(
          req,
          res,
          rowsAffected,
          `Delete successful! Count of deleted rows: ${rowsAffected}`,
        );
      } else {
        requestErrorHandler(req, res, `Invalid number id: ${req.params.id}`);
      }
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, 'Error');
    });
});

export default category;
