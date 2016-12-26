'use strict'
import * as constControll from './const.controller';


import Router from 'koa-router';

let router = Router();

//常量
router.get('/const/enums', constControll.getEnums);
router.get('/const/options', constControll.getOptions);
router.get('/const/kvmap', constControll.getKVMap);
router.get('/const/vkmap', constControll.getVKMap);
router.get('/const/vnmap', constControll.getVNMap);



export default router;