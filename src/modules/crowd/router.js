'use strict'
import Router from 'koa-router';
import * as CrowdController from './crowd.controller';
import * as filter from '../task/task.filter';

const router = Router({
    prefix: '/crowd'
});

//人群分页接口
router.get('/pages', filter.pages, CrowdController.pages);
//人群所有的list
router.get('/list', CrowdController.list);
//下载人群上传模板
router.get('/download/template', CrowdController.downloadTemplate);
//下载上传失败的人群校验模板
router.get('/download/validate/:id', filter.query, CrowdController.downloadValidate)
//上传人群模板 新建人群接口
router.post('/upload', CrowdController.upload);
//删除人群接口
router.delete('/:id', filter.query, CrowdController.remove);

export default router;