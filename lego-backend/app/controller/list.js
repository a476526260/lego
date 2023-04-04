'use strict';

const { Controller } = require('egg');

class ListController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = [{ id: 1, name: 'dennyzhou', age: 30 }, { id: 2, name: 'doris', age: 32 }];
  }
}

module.exports = ListController;
