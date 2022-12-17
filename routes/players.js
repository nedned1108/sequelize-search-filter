const express = require('express');
const router = express.Router();

const { Player } = require('../db/models');

router.get('/', async (req, res) => {
  let { firstName, number, page, size } = req.query;
  const query = {}

  page = page ? +page : 1;
  size = size ? +size : 2;

  if (size > 10) {
    size = 10;
  }

  if (page > 0 && size > 0 && size <= 10) {
    query.limit = size;
    query.offset = size * (page - 1)
  }

  const where = {};
  if (firstName && firstName !== '') {
    where.firstName = firstName[0].toUpperCase() + firstName.slice(1);
  } else if (firstName === '') {
    res.status(400);
    return res.json({
      errors: [
        { message: 'firstName filter should not be empty' }
      ]
    });
  }

  if (number) {
    if (!Number.isNaN(number) && number >= 0) {
      where.number = parseInt(number);
    } else {
      res.status(400);
      return res.json({
        errors: [
          { message: 'number filter should be a number greater or equal to 0' }
        ]
      });
    }
  }

  const players = await Player.findAll({
    where,
    ...query
  });
  return res.json({
    players,
    page,
    size
  });
});

module.exports = router;
