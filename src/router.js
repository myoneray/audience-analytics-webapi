'use strict'

import crowdRouter from './modules/crowd/router';
import taskRouter from './modules/task/router';
import baseRouter from './modules/base/router';
import tagsRouter from './modules/tags/router';
import analysisRouter from './modules/analysis/router';

export default function(app){
    app.use(crowdRouter.routes());
    app.use(taskRouter.routes());
    app.use(baseRouter.routes());
    app.use(tagsRouter.routes());
    app.use(analysisRouter.routes());
}