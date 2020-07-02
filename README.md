# live2d_src
基于 [#fea64e4](https://github.com/EYHN/hexo-helper-live2d/commit/fea64e49a760ded5cc2dad974fd3d55bcebe15c6) 的修改版

记录编译方法：

1. 使用VS CODE打开后会有推荐安装的插件，请尽量安装

2. 还需安装node.js后使用npm命令：

- Win系统：在PowerShell（非管理员）  
输入：
1. `npm install webpack -g` 
2. `npm install webpack-cli -g` 
3. `npm install webpack-dev-server -g`
可替换：  
-  `-g`是全局安装参数
- `--save-dev`是本项目安装参数

- 编译命令：`webpack --config .\webpack.config.js`

- 调试命令：`webpack-dev-server --config .\webpack.config.js`

- webpack视频教学：https://www.bilibili.com/video/av31582899/

- 此更新已包含 [fghrsh：fix #6 cache API respomnse](https://github.com/fghrsh/live2d_demo/issues/6)

- 如果提示：无法加载文件 \npm\webpack.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
- 解决方法：使用管理员权限运行PowerShell 执行：`set-ExecutionPolicy RemoteSigned`