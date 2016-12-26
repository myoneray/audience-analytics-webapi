'use strict'
import Router from 'koa-router';
import * as TagsController from './tags.controller';

const router = Router({
    
});

router.get('/tags/all',TagsController.AllTags);
router.get('/valKVs/:uid',TagsController.valKVs);

export default router;