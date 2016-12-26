'use strict'
import Router from 'koa-router';
import * as TaskController from './task.controller';
import * as filter from './task.filter';

const router = Router({
    prefix: '/task'
});
router.get('/pages', filter.pages, TaskController.pages);

router.post('/', filter.create, TaskController.create);
router.get('/query/:id', filter.query, TaskController.query);
router.put('/:id', filter.update, TaskController.update);
router.delete('/:id', filter.query, TaskController.remove);


router.get('/test', TaskController.test);

export default router;