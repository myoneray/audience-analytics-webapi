'use strict'
import Router from 'koa-router';
import * as AnalysisController from './analysis.controller';
import * as filter from '../task/task.filter';


const router = Router({
    prefix: '/analysis'
});
//分析页面接口
router.get('/:id', filter.query, AnalysisController.analysis);
//下载分析的报表
router.get('/download/:id', filter.query, AnalysisController.download);
router.post('/', AnalysisController.create);

export default router;