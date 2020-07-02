# live2d_src
基于 [#fea64e4](https://github.com/EYHN/hexo-helper-live2d/commit/fea64e49a760ded5cc2dad974fd3d55bcebe15c6) 的修改版

记录编译方法：

1. 使用VS CODE打开后会有推荐安装的插件，请尽量安装

2. 还需安装node.js后使用npm命令：

- Win系统：在PowerShell（非管理员）输入`npm install webpack -g` 和 `npm install webpack-cli -g` 全局安装webpack工具。
非全局安装将参数`-g`替换为`--save-dev`。

- 运行命令：`webpack --config webpack.config.js`

- webpack视频教学：https://www.bilibili.com/video/av31582899/

- 如果提示：无法加载文件 \npm\webpack.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
- 解决方法：使用管理员权限运行PowerShell 执行：`set-ExecutionPolicy RemoteSigned`
