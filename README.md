# NeatChat
NeatChat是基于NextChat的一个全新的版本，并进行了多项优化。NeatChat目前有三个分支，分别是main分支，mini分支，preview分支，preview分支是main分支的预览分支，在稳定之后会合并到main分支，mini分支是单独的一个精简分支。main分支的使命在于基于优化UI和新增功能，以至于后面脱离NextChat，独立发展，而mini分支则会在NextChat的基础上进行微调和删减，紧跟NextChat的步伐，只有main分支特别重要的功能才会下放到mini分支。由于main分支和mini分支的目的不一样，所以也将有两套UI。


> [演示站](https://neat.tz889.us.kg)

# 新旧对比

<table style="border-collapse: collapse; border: 0.2px solid #ddd; width: 100%;">
  <tr>
    <th style="border: 0.2px solid #ddd; padding: 8px; text-align: center;">原版</th>
    <th style="border: 0.2px solid #ddd; padding: 8px; text-align: center;">新版</th>
  </tr>
  <tr>
    <td style="border: 0.2px solid #ddd; padding: 4px;"><img src="https://raw.githubusercontent.com/tianzhentech/static/main/images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-12-15%20135339.png" style="width: 100%; height: auto;"/></td>
    <td style="border: 0.2px solid #ddd; padding: 4px;"><img src="https://raw.githubusercontent.com/tianzhentech/static/main/images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-12-15%20191534.png" style="width: 100%; height: auto;"/></td>
  </tr>
  <tr>
    <td style="border: 0.2px solid #ddd; padding: 4px;"><img src="https://raw.githubusercontent.com/tianzhentech/static/main/images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-12-15%20135556.png" style="width: 100%; height: auto;"/></td>
    <td style="border: 0.2px solid #ddd; padding: 4px;"><img src="https://raw.githubusercontent.com/tianzhentech/static/main/images/%7B978B620E-77AF-44CB-A871-2DFC075E56FD%7D.png" style="width: 100%; height: auto;"/></td>
  </tr>
  <tr>
    <td style="border: 0.2px solid #ddd; padding: 4px;"><img src="https://raw.githubusercontent.com/tianzhentech/static/main/images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-12-15%20135643.png" style="width: 100%; height: auto;"/></td>
    <td style="border: 0.2px solid #ddd; padding: 4px;"><img src="https://raw.githubusercontent.com/tianzhentech/static/main/images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-12-15%20191722.png" style="width: 100%; height: auto;"/></td>
  </tr>
</table>


# 快速开始
1. 支持vercel一键部署：[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tianzhentech/NeatChat.git)

2. docker只需要替换官方**yidadaa/chatgpt-next-web:版本号**为**tianzhentech/chatgpt-next-web:latest**即可

> 详细使用请参考[NextChat](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web)
# 开发计划
> 以下不分先后顺序

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed;">
  <tr>
    <th style="text-align: center; padding: 8px; border: 1px solid #ddd; width: 60px; min-width: 60px; white-space: nowrap;">序号</th>
    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">详情</th>
    <th style="text-align: center; padding: 8px; border: 1px solid #ddd; width: 80px; min-width: 80px; white-space: nowrap;">优先级</th>
    <th style="text-align: center; padding: 8px; border: 1px solid #ddd; width: 100px; min-width: 100px; white-space: nowrap;">预计时间</th>
    <th style="text-align: center; padding: 8px; border: 1px solid #ddd; width: 80px; min-width: 80px; white-space: nowrap;">状态</th>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">1</td>
    <td style="padding: 8px; border: 1px solid #ddd;">去除广告，精简语言包，调整UI，适配更多视觉模型</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2-3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">已完成</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2</td>
    <td style="padding: 8px; border: 1px solid #ddd;">全平台打包（Windows、Mac、Linux、Android、iOS、Docker）</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">1天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">暂时搁置中，只打包了windows和docker，其余暂时可以用pwa替代</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">3</td>
    <td style="padding: 8px; border: 1px solid #ddd;">开启preview分支，提前体验新功能，preview分支会定期合并到main分支</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">1天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">已完成</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">4</td>
    <td style="padding: 8px; border: 1px solid #ddd;">增加多彩主题（支持启动时或者启动后切换基本色）</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">积极</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">即将开启</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">5</td>
    <td style="padding: 8px; border: 1px solid #ddd;">增加Neat模式（改善在移动设备上的使用体验）</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">计划中</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">6</td>
    <td style="padding: 8px; border: 1px solid #ddd;">开启mini分支，去除面具，实时语音等不常用功能</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">已完成</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">7</td>
    <td style="padding: 8px; border: 1px solid #ddd;">改进聊天记录同步功能</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2-3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">计划中</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">8</td>
    <td style="padding: 8px; border: 1px solid #ddd;">优化本地消息过多导致的流式变慢问题</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2-3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">计划中</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">9</td>
    <td style="padding: 8px; border: 1px solid #ddd;">增加上传文件功能，改进由于发送文本过长导致的输入框卡顿问题</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">次级</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2-3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">计划中</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">10</td>
    <td style="padding: 8px; border: 1px solid #ddd;">新增对多种模型avatar的适配</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">积极</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2-3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">已完成</td>
  </tr>
    <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">11</td>
    <td style="padding: 8px; border: 1px solid #ddd;">适配Lobe Icons，新增模型搜索功能（可关闭）</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">积极</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">2-3天</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">已完成</td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">......</td>
    <td style="padding: 8px; border: 1px solid #ddd;">各位朋友们的建议</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">......</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">......</td>
    <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">......</td>
  </tr>
</table>

# preview分支开启
自1.1.5版本开始，从main分支分裂出去一个单独的preview分支，preview分支会定期合并到main分支，大家可以在preview分支体验到最新的功能，但是preview分支不会进行打包，只会打包main分支，不过会打包docker，所以大家如果想要体验最新功能，请自行编译。

# mini分支开启
自1.1.4版本开始，从main分支分裂出去一个单独的mini分支，main分支后续大部分非实用功能都不会在mini分支适配，mini分支将紧跟nextchat官方更新，而且后续面具，实时语音等等也将剔除。
## Star History

<div style="width: 100%;">
  <a href="https://star-history.com/#tianzhentech/ChatGPT-Next-Web&Date">
    <img src="https://api.star-history.com/svg?repos=tianzhentech/ChatGPT-Next-Web&type=Date" style="width: 100%; height: auto;">
  </a>
</div>
