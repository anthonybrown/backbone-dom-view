// Generated by LiveScript 1.2.0
(function(){
  var slice$ = [].slice;
  function def(modules, module){
    if (typeof define === 'function' && define.amd) {
      return define(modules, module);
    } else {
      return module(Backbone);
    }
  }
  def(['backbone'], function(Backbone){
    var DOMView, helpers, dividedField, fieldEvent, viewEvent, argSelector;
    DOMView = Backbone.DOMView = Backbone.View.extend({
      constructor: function(ops){
        var rest, selector, ref$, helps, helper, options, own$ = {}.hasOwnProperty;
        rest = slice$.call(arguments, 1);
        if (ops instanceof Backbone.Model) {
          Backbone.View.apply(this, [{
            model: ops
          }].concat(rest));
        }
        Backbone.View.apply(this, arguments);
        for (selector in ref$ = this.template) if (own$.call(ref$, selector)) {
          helps = ref$[selector];
          for (helper in helps) if (own$.call(helps, helper)) {
            options = helps[helper];
            helpers[helper].call(this, selector, options);
          }
        }
      },
      find: function(selector){
        if (selector) {
          return this.$el.find(selector);
        } else {
          return this.$el;
        }
      }
    });
    helpers = DOMView.helpers = {
      'class': classHelper,
      attr: attrHelper,
      prop: propHelper,
      on: onHelper,
      connect: connectHelper
    };
    function classHelper(selector, options){
      prepareNode.call(this, this.find(selector), 'toggleClass', options, function(v){
        return !!v;
      });
    }
    function attrHelper(selector, options){
      prepareNode.call(this, this.find(selector), 'attr', options);
    }
    function propHelper(selector, options){
      prepareNode.call(this, this.find(selector), 'prop', options);
    }
    function onHelper(selector, options){
      var node, event, func, own$ = {}.hasOwnProperty, this$ = this;
      node = this.find(selector);
      for (event in options) if (own$.call(options, event)) {
        func = options[event];
        node.on(event, fn$);
      }
      function fn$(){
        return func.apply(this$, arguments);
      }
    }
    function connectHelper(selector, options){
      var node, i$, own$ = {}.hasOwnProperty;
      node = this.find(selector);
      for (i$ in options) if (own$.call(options, i$)) {
        (fn$.call(this, i$, options[i$]));
      }
      function fn$(prop, field){
        var event, propEvent, x, this$ = this;
        event = 'change';
        if (propEvent = prop.match(dividedField)) {
          x = propEvent[0], prop = propEvent[1], event = propEvent[2];
        }
        node.on(event, function(){
          return this$.model.set(field, node.prop(prop));
        });
        this.model.on('change:' + field, function(model, value){
          return node.prop(prop, value);
        });
      }
    }
    dividedField = /^(.+)\|(.+)/;
    fieldEvent = /@([\w-]+)/;
    viewEvent = /#([\w-:\.]+)/;
    argSelector = /\|arg\((\d+)\)/;
    function prepareNode(node, method, options, wrapper){
      var model, view, i$, own$ = {}.hasOwnProperty;
      model = this.model;
      view = this;
      for (i$ in options) if (own$.call(options, i$)) {
        (fn$.call(this, i$, options[i$]));
      }
      function fn$(name, value){
        var events, i$, len$, own$ = {}.hasOwnProperty;
        switch (typeof value) {
        case 'string':
          events = value.split(/\s+/);
          for (i$ = 0, len$ = events.length; i$ < len$; ++i$) {
            (fn$.call(this, events[i$]));
          }
          break;
        case 'object':
          for (i$ in value) if (own$.call(value, i$)) {
            (fn1$.call(this, i$, value[i$]));
          }
        }
        function fn$(event){
          var target, argNum, func;
          target = model;
          argNum = 0;
          event = event.replace(argSelector, function(x, num){
            argNum = num;
            return '';
          });
          func = wrapper ? wrappedHandler : handler;
          event = event.replace(fieldEvent, function(x, field){
            target = model;
            argNum = 1;
            func(target, model.get(field));
            return 'change:' + field;
          });
          event = event.replace(viewEvent, function(x, event){
            target = view;
            func();
            return event;
          });
          target.on(event, func);
          function handler(){
            node[method](name, arguments[argNum]);
          }
          function wrappedHandler(){
            node[method](name, wrapper(arguments[argNum]));
          }
        }
        function fn1$(event, func){
          var handler;
          handler = wrapper
            ? function(){
              return node[method](name, wrapper(func.apply(view, arguments)));
            }
            : function(){
              return node[method](name, func.apply(view, arguments));
            };
          model.on(event, handler);
        }
      }
    }
    return DOMView;
  });
}).call(this);