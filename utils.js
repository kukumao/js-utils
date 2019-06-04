//utils.js
;
(function(undefined) {
	"use strict"

	let _global;
	let handleTime = {
		/**
		 * 格式化时间
		 * 
		 * @param  {time} date对象或时间戳,时间戳要精确到毫秒
		 * @param  {dateSeparator} 日期分隔符
		 * @param  {timeSeparator} 时间分隔符
		 * @return {String} 字符串
		 *
		 * @example formatTime(new Date(), '-', ':') // -> 2017-10-15 00:00:00
		 */
		formatTime: function(time, dateSeparator = '-', timeSeparator = ':') {
			if(arguments.length === 0) {
				return null;
			}
			let date;
			if(typeof time === 'object') {
				date = time;
			} else if(typeof time === 'number' && time % 1 === 0) {
				date = new Date(time);
			} else {
				return null;
			}
			let [year, month, day, hour, minute, second] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
			if(month < 10) month = '0' + month;
			if(day < 10) day = '0' + day;
			if(hour < 10) hour = '0' + hour;
			if(minute < 10) minute = '0' + minute;
			if(second < 10) second = '0' + second;
			let value = year + dateSeparator + month + dateSeparator + day + ' ' + hour + timeSeparator + minute + timeSeparator + second;
			return value;
		},
		/**
		 * 格式化日期
		 * 
		 * @param  {time} date对象或时间戳,时间戳要精确到毫秒
		 * @param  {dateSeparator} 日期分隔符
		 * @return {String} 字符串
		 *
		 * @example formatDate(new Date(), '-') // -> 2017-10-15
		 */
		formatDate: function(time, dateSeparator = '-') {
			if(arguments.length === 0) {
				return null;
			}
			let date;
			if(typeof time === 'object') {
				date = time;
			} else if(typeof time === 'number' && time % 1 === 0) {
				date = new Date(time);
			} else {
				return null;
			}
			let [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			if(month < 10) month = '0' + month;
			if(day < 10) day = '0' + day;
			let value = year + dateSeparator + month + dateSeparator + day;
			return value;
		},
		/**
		 * 格式化时间(包含星期)
		 * 
		 * @param  {time} date对象或时间戳,时间戳要精确到毫秒
		 * @param  {dateSeparator} 日期分隔符
		 * @param  {timeSeparator} 时间分隔符
		 * @return {String} 字符串
		 *
		 * @example parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s} {w}') // -> 2017-10-15 00:00:00
		 */
		parseTime: function(time, cFormat) {
			if(arguments.length === 0) {
				return null;
			}
			let date;
			if(typeof time === 'object') {
				date = time;
			} else if(typeof time === 'number' && time % 1 === 0) {
				date = new Date(time);
			} else {
				return null;
			}
			const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
			const formatObj = {
				y: date.getFullYear(),
				m: date.getMonth() + 1,
				d: date.getDate(),
				h: date.getHours(),
				i: date.getMinutes(),
				s: date.getSeconds(),
				w: date.getDay()
			};
			const timeStr = format.replace(/{(y|m|d|h|i|s|w)+}/g, (result, key) => {
				let value = formatObj[key];
				if(key === 'w') return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][value];
				if(result.length > 0 && value < 10) {
					value = '0' + value;
				}
				return value || 0;
			});
			return timeStr;
		}
	};
	let handlePrice = {
		/**
		 * 格式化价格
		 * 
		 * @param  {price} 价格
		 * @return {String} 字符串
		 *
		 * @example priceSwitch(200000) // -> 200,000.00
		 */
		priceSwitch: function(price) {
			let f = parseFloat(price);
			if(isNaN(f)) return null;
			// 保留两位小数
			f = Math.round(price * 100) / 100;
			let s = f.toString();
			let rs = s.indexOf('.');
			if(rs < 0) {
				rs = s.length;
				s += '.';
			}
			while(s.length < (rs + 1) + 2) {
				s += '0';
			}
			//每三位用一个逗号隔开
			let leftNum = s.split(".")[0];
			let rightNum = "." + s.split(".")[1];
			let result;
			//定义数组记录截取后的价格
			let resultArray = [];
			if(leftNum.length > 3) {
				let i = true;
				while(i) {
					resultArray.push(leftNum.slice(-3));
					leftNum = leftNum.slice(0, leftNum.length - 3);
					if(leftNum.length < 4) {
						i = false;
					}
				}
				//由于从后向前截取，所以从最后一个开始遍历并存到一个新的数组，顺序调换
				let sortArray = [];
				for(let i = resultArray.length - 1; i >= 0; i--) {
					sortArray.push(resultArray[i]);
				}
				result = leftNum + "," + sortArray.join(",") + rightNum;
			} else {
				result = s;
			}
			return result;
		}
	}
	let handleArray = {
		/**
		 * ES6数组去重
		 * 
		 * @param  {arr} 原数组
		 * @return {Array} 去重后的数组
		 *
		 * @example dedupe1([2,2,2]) // -> [2]
		 */
		dedupe1: function(arr) {
			return [...new Set(arr)];
		},
		/**
		 * 非ES6数组去重
		 * 
		 * @param  {arr} 原数组
		 * @return {Array} 去重后的数组
		 *
		 * @example dedupe2([2,2,2]) // -> [2]
		 */
		dedupe2: function(arr) {
			//第一次出现的的元素下标才等于下标
			return arr.filter((item, index, arr) => arr.indexOf(item) === index)
		},
		/**
		 * 取出两个数组的不同元素 
		 * 
		 * @param  {arr1} 数组1
		 * @param  {arr2} 数组2
		 * @return {Array} 数组
		 *
		 * @example getArrDifference([1,2,3],[2,3,4]) // -> [1,4]
		 */
		getArrDifference: function(arr1, arr2) {
			return arr1.concat(arr2).filter(function(v, i, arr) {
				return arr.indexOf(v) === arr.lastIndexOf(v);
			});
		},
		/**
		 * 取出两个数组的相同元素 
		 * 
		 * @param  {arr1} 数组1
		 * @param  {arr2} 数组2
		 * @return {Array} 数组
		 *
		 * @example getArrEqual([1,2,3],[2,3,4]) // -> [2,3]
		 */
		getArrEqual: function(arr1, arr2) {
			let newArr = [];
			for(let i = 0; i < arr2.length; i++) {
				for(let j = 0; j < arr1.length; j++) {
					if(arr1[j] === arr2[i]) {
						newArr.push(arr1[j]);
					}
				}
			}
			return newArr;
		},
		/**
		 * 复制数组
		 * 
		 * @param  {arr} 数组
		 * @return {Array} 新数组
		 *
		 * @example copyArr([1,2,3]) // -> [1,2,3]
		 */
		copyArr(arr) {
			let res = []
			for(let i = 0; i < arr.length; i++) {
				res.push(JSON.parse(JSON.stringify(arr[i])))
			}
			return res;
		}
	}
	let handleData = {
		/**
		 * 将url参数转成对象
		 * 
		 * @param  {urlParam} url路径
		 * @return {Object} 对象
		 *
		 * @example formatParamToObj('http://127.0.0.1:8020/index.html?age=18&name=zhouck') // -> {age: "18", name: "zhouck"}
		 */
		formatParamToObj: function(urlParam) {
			if(!urlParam) return null;
			if(urlParam.charAt(0) == "?") urlParam = urlParam.substr(1);
			let reg = /([^?=&]+)\=([^?=&]*)/g;
			let v = {};
			let r;
			while(true) {
				if((r = reg.exec(urlParam))) {
					v[r[1]] = decodeURIComponent(r[2]);
				} else {
					break;
				}
			}
			return v;
		},
		/**
		 * 将对象转成url参数
		 * 
		 * @param  {urlParam} url路径
		 * @return {Object} 对象
		 *
		 * @example formatObjToParam({name: 'tom',age: 15}) // -> name=tom&age=15
		 */
		formatObjToParam: function(obj) {
			if(!obj || JSON.stringify(obj) === '{}') return null;
			let urlParam = [];
			for(let attr in obj) {
				urlParam.push(`${attr}=${encodeURIComponent(obj[attr])}`);
			}
			return urlParam.join('&');
		},
		/**
		 * 根据key的值获取value的值
		 * 
		 * @param  {arr} 数组
		 * @param  {key} key名
		 * @param  {keyValue} key值
		 * @param {distKey} value名
		 * @return {distVlue} value值
		 *
		 * @example 
		 * let arr = [{key:1,value:'哈哈'},{key:2,value:'呵呵'}]
		 * getObjAttrInArr(arr,'key',1,'value') // -> 哈哈
		 */
		getObjAttrInArr: function(arr, key, keyValue, distKey) {
			if(arguments.length < 4) {
				return null;
			}
			for(let i = 0, l = arr.length; i < l; i++) {
				if(arr[i][key] === keyValue) {
					return arr[i][distKey];
				}
			}
		},
		/**
		 * 丢掉 ‘_’开头的属性同时过滤空属性
		 * 
		 * @param  {pm} 原始对象
		 * @return {Object} 过滤后的对象
		 *
		 * @example filterParam({_key:1,value:'哈哈',name:''}) // -> name=tom&age=15
		 */
		filterParam: function(pm) {
			if(!pm || JSON.stringify(pm) === '{}') return null;
			let rsPm = {};
			for(let key in pm) {
				if(pm[key] && JSON.stringify(pm[key]) !== '{}' && JSON.stringify(pm[key]) !== '[]') {
					if(!key.startsWith('_')) {
						rsPm[key] = pm[key];
					}
				}
			}
			return rsPm;
		},
	}

	let utils = {
		handleTime: handleTime,
		handlePrice: handlePrice,
		handleArray: handleArray,
		handleData: handleData
	}

	// 最后将插件对象暴露给全局对象
	_global = (function() {
		return this || (0, eval)('this');
	}());
	if(typeof module !== "undefined" && module.exports) {
		module.exports = utils;
	} else if(typeof define === "function" && define.amd) {
		define(function() {
			return utils;
		});
	} else {
		!('utils' in _global) && (_global.utils = utils);
	}
}());