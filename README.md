
## 背景

前端项目通过给element添加一个特殊的属性（以下成为特殊标识）进行埋点，然后对根root进行事件不过，之后带着这个属性进行上报。

在后台系统会记录着用户哪分哪秒对带着特殊标识的element进行点击或者其他操作

但是debug的时候，如果只在控制台搜索或者代码上搜索有点不方版

## 使用

拷贝index.js脚本，在控制台运行即可


## TODO

- [x] 显示鼠标悬浮的元素的提示
- [ ] 碰撞检测目前只有tooltip之间的，需要增加tooltip和window的碰撞检测
- [ ] 一键显示所有提示
- [ ] 鼠标悬浮在提示上时，对应的元素用border进行显眼的提示
- [ ] 以插件的形式集成到Chrome中
