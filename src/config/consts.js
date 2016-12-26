let enums = {};
let options = {};
let optionObjs = {};
let optionValKeyMaps = {};
let optionKeyValMaps = {};
let optionValNameMaps = {};

function flat(data, key = 'id') {
	var dist = {};
	for (let i = 0, item; i< data.length; i++) {
		item = data[i];
		dist[item[key]] = item.value;
	}
	return dist;
}
function flatKey(data, key = 'id') {
	var dist = {};
	for (let i = 0, item; i< data.length; i++) {
		item = data[i];
		dist[item[key]] = item;
	}
	return dist;
}

function keyValMap(data ,key="id"){
	var map = {};
	for (let i = 0, item; i< data.length; i++) {
		item = data[i];
		map[item[key]] = item.value;
	}
	return map;
}

function valKeyMap(data ,key="id"){
	var map = {};
	for (let i = 0, item; i< data.length; i++) {
		item = data[i];
		map[item.value] = item[key];
	}
	return map;
}

function valNameMap(data ,key="id"){
	var map = {};
	for (let i = 0, item; i< data.length; i++) {
		item = data[i];
		map[item.value] = item.name;
	}
	return map;
}

function add(name, item, key = 'id') {
	enums[name] = flat(item);
	options[name+"OPTION"] = item;
	optionObjs[name+"OBJ"] = flatKey(item);
	optionKeyValMaps[name+"KVMAP"] = keyValMap(item, key);
	optionValKeyMaps[name+"VKMAP"] = valKeyMap(item, key);
	optionValNameMaps[name+"VNMAP"] = valNameMap(item, key);
}

add('ResponseStatus', [{
	id: "normal",
	code: "E0",
	message: "ok"
}]);

//任务状态
add('TaskStatus', [{
	id: "loading",
	value: 0,
	name: "等待中"
},{
	id: "executing",
	value: 1,
	name: "执行中"
},{
	id: "stop",
	value: 2,
	name: "已停止"
},{
	id: "failure",
	value: 3,
	name: "执行失败"
},{
	id: "success",
	value: 4,
	name: "执行完成"
},{
	id: "delete",
	value: 5,
	name: "任务被删除"
}]);

//人群上传状态
add('UploadStatus', [{
	id: "uploading",
	value: 1,
	name: "上传中"
},{
	id: "partsuccess",
	value: 2,
	name: "部分成功"
},{
	id: "success",
	value: 3,
	name: "上传成功"
},{
	id: "failure",
	value: 4,
	name: "上传失败"
}]);

//计算周期
add('PeriodStatus', [{
	id: "immediately",
	value: "D",
	name: "一次性"
},{
	id: "weekly",
	value: "W",
	name: "每周"
},{
	id: "monthly",
	value: "M",
	name: "每月"
}]);




add('ClientType', [{
	id: "yl",
	value: 0,
	name: "银联"
}, {
	id: "user",
	value: 1,
	name: "客户"
}]);

//删除状态
add('Delete', [{
	id: "nodeleted",
	value: 0,
	name: "正常"
}, {
	id: "deleted",
	value: 1,
	name: "已删除"
}]);




export {
	enums,
	options,
	optionObjs,
	optionKeyValMaps,
	optionValKeyMaps,
	optionValNameMaps
}