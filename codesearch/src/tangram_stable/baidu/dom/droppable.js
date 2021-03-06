/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/droppable.js
 * author: rocy
 * version: 1.4.0
 * date: 2010/10/14
 */

///import baidu.dom.g;
///import baidu.dom.ddManager;
///import baidu.dom.getPosition;
///import baidu.page.getMousePosition;
///import baidu.dom.intersect;


//TODO: 添加对 accept, hoverclass 等参数的支持.
/**
 * 让一个DOM元素可以容纳被拖拽的DOM元素
 * @name baidu.dom.droppable
 * @function
 * @grammar baidu.dom.droppable(element[, options])
 * @param {HTMLElement|string} element 容器元素或者容器元素的ID
 * @param {Object} [options] 选项，拖拽元素对于容器元素的事件
                
 * @config {Function} [ondrop] 当元素放到容器元素内部触发
 * @config {Function} [ondropover] 当元素在容器元素上方时触发
 * @config {Function} [ondropout] 当元素移除容器元素时触发
 * @version 1.3
 * @remark
 * 
            需要将元素和容器元素的定位都设置为absolute
        
 * @see baidu.dom.droppable
 *             
 * @returns {Function} cancel取消拖拽
 */
baidu.dom.droppable = function(element, options){
	options = options || {};
	var manager = baidu.dom.ddManager,
		target = baidu.dom.g(element),
		//拖拽进行时判断
		_dragging = function(event){
			var _targetsDroppingOver = manager._targetsDroppingOver;
			//判断被拖拽元素和容器是否相撞
			if(baidu.dom.intersect(target, event.DOM)){
				//进入容器区域
				if(! _targetsDroppingOver[target]){
					//初次进入
					(typeof options.ondropover == 'function') && options.ondropover.call(target,event.DOM);
					manager.dispatchEvent("ondropover", {trigger:event.DOM,reciever: target});
					_targetsDroppingOver[target] = true;
				}
			} else {
				//出了容器区域
				if(_targetsDroppingOver[target]){
					(typeof options.ondropout == 'function') && options.ondropout.call(target,event.DOM);
					manager.dispatchEvent("ondropout", {trigger:event.DOM,reciever: target});
				}
				delete _targetsDroppingOver[target];
			}
		},
		//拖拽结束时判断
		_dragend = function(event){
			if(baidu.dom.intersect(target, event.DOM)){
				typeof options.ondrop == 'function' && options.ondrop.call(target, event.DOM);
				manager.dispatchEvent("ondrop", {trigger:event.DOM,reciever: target});
			}
			delete manager._targetsDroppingOver[target];
		};
	//事件注册,return object提供事件解除
	manager.addEventListener("ondrag", _dragging);
	manager.addEventListener("ondragend", _dragend);
	return {
		cancel : function(){
			manager.removeEventListener("ondrag", _dragging);
			manager.removeEventListener("ondragend",_dragend);
		}
	};
};
