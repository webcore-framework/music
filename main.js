import components from "./components/index.js";
import router from "./router/index.js";

const app = window.webcore;

app.setConfig('base', 'http://chinbeker.qicp.vip:5152');
app.setConfig('song', 'http://chinbeker.qicp.vip:5153/song');
app.setConfig('cover', 'http://chinbeker.qicp.vip:5152/img/music');
app.setConfig('video', 'http://chinbeker.qicp.vip:5153/mv');
app.setConfig('lyrics', 'http://chinbeker.qicp.vip:5153/lrc/song');

app.useComponent(components);
app.useRouter(router);
app.run();
