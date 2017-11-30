# util
自主前端工具库，包含控件组件、文件加载等工具内容。
## zp.load.js
基于LAB.js实现的DOM文件加载器，参照require.js实现配置参数，支持样式加载、js加载，区分同步、异步加载，项目路径自动识别等功能。
## zp.tpl-0.2.js
基于underscore.template方法封装的前端模板引擎，参考art-template实现了ZP.tpl良好的调试、异常捕获机制，支持web项目中以文件的方式存储独立模板，支持自定义标签的实现。
## detailModel.js
基于BackBone.Model封装的前端数据对象，支持与modelRenderer结合自动渲染表单。
## modelRenderer.js
支持detailModel的表单自动渲染组件，通过页面注册和简单配置，实现表单自动渲染。
