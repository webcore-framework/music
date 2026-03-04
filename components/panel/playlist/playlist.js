export default class Playlist extends webcore.component.builder {

    static tag = 'app-playlist';

    create(){
        this.template(
`<div class="body">
    <header>
        <h2>播放列表</h2>
        <div class="thead"><span></span><span>歌曲名</span><span>艺术家</span><span>专辑</span></div>
    </header>
    <main><table border="0" cellpadding="0" cellspacing="0"></table></main>
</div>
<footer>
    <button type="button">关闭</button>
</footer>`
        )
        .styles('/components/panel/playlist/playlist.css')
        .mode('closed')
        .inject(['event', 'state', 'cache', 'reactive', 'http']);

        Object.sealProp(this, 'value', null);
    }

    onCreated(){
        const { state, reactive } = this.services;
        this.element = {table: this.querySelector('table')}

        // 播放列表的打开状态保存到组件内
        this.state.opened = reactive.store(!this.classList.contains("close"));
        this.state.opened.onchange = (val)=>{
            if (val){
                this.classList.remove("close")
            } else {
                this.classList.add("close")
            }
        }

        // 当前选择状态
        this.state.current = reactive.store(this.querySelector('tr.play'));
        this.state.current.onchange = (val, old)=>{
            if (val !== old){
                if (old){old.classList.remove('play')};
                val.classList.add('play')
            }
        };

        // 保存到全局状态，全局使用
        state.set("playlist", this.state.opened);
    }

    onBeforeMount(){
        const event = this.services.event;

        // 关闭页面按钮
        event.select(this.querySelector("button")).click(
            ()=>{this.close()}
        ).bind();


        // 给歌词列表绑定点击选择事件（事件委托）
        event.select(this.querySelector("table")).click(
            (e)=>{
                const target = event.target(e, "tr");
                this.state.current.value = target;
                const order = parseInt(target.firstElementChild.textContent);
                const song = this.select(order);
                if (song){event.emit('player', 'play', song)}
            }
        ).bind();

        // 暴露接口
        event.expose("playlist", {
            open: ()=>this.open(),
            close: ()=>this.close(),
            toggle: ()=>this.toggle(),
            change: (songs)=>this.change(songs),
            count: ()=>this.count(),
            select: (order)=>this.select(order)
        });


        // 加载默认播放列表
        this.start();
    }


    // 加载默认播放列表
    async start(){
        // 创建Api
        const http = this.services.http;
        this.api = http.create({
            url: '/api/playlist',
            baseUrl: 'http://chinbeker.picp.vip:5161'
        });
        // 加载
        const res = await this.api.get();
        if (res.code === 200) {
            this.change(res.data);
            // 自动切换第一首
            const song = this.select(1);
            if (song) {this.services.event.emit('player', 'change', song)}
        }
    }


    // 组件方法
    open(){
        this.state.opened.value = true;
        this.state.current.value.scrollIntoView()
    }
    close(){this.state.opened.value = false}
    toggle() {this.state.opened.value = !this.state.opened.value}

    // 更改并渲染播放列表
    change(songs){
        if (Array.isArray(songs)){
            this.value = songs;
            const tbody = document.createElement('tbody');
            let tr = null;
            let song = null;
            for (let i = 0;i< songs.length;i ++){
                song = songs[i]
                tr = Element.createAll({
                    tag: "tr",
                    children: [
                        {tag: "td", text: i+1},
                        {tag: "td", text: song.title},
                        {tag: "td", text: song.artist},
                        {tag: "td", text: song.album}
                    ]
                });
                tbody.append(tr);
                tr = null;
                song = null;
            }
            this.element.table.replaceChildren(tbody);
        }
    }

    select(order){
        if (typeof order !== 'number'){return null}
        if (Array.isArray(this.value) && this.value.length >= order){
            const tbody = this.element.table.firstElementChild;
            if (tbody){
                this.state.current.value = tbody.children[order-1];
            }
            const song  = this.value[order - 1];
            song.order = order;
            song.count = this.count();
            return song;
        }
        return null;
    }

    count(){
        if (this.element.table.firstElementChild == null){return 0;}
        return this.element.table.firstElementChild.children.length;
    }
}
