export default class SongsView extends webcore.component.builder {

    static tag = 'view-songs';

    create(){
        this.template(
`<header>
    <song-carousel></song-carousel>
    <song-infor></song-infor>
</header>
<main>
    <div><ol></ol></div>
</main>`)
        .styles('/views/songs/songs.css')
        .mode('closed')
        .inject(['event'])
    }

    onCreated() {
        const { event } = this.services;
        this.element = {
            ol: this.querySelector('ol'),
            carousel: this.querySelector('song-carousel'),
            infor: this.querySelector('song-infor'),
        };

        this.state.selected = false;

        event.select(this.element.ol).click(
            (e)=>{
                const target = event.target(e, "li");
                const order = parseInt(target.dataset.order);
                if (!this.state.selected){
                    event.emit('playlist', 'change', this.value);
                    this.state.selected = true;
                }
                const song = event.emit('playlist', 'select', order);
                event.emit('player','play', song)
            }
        ).bind()
    }

    async render(route) {

        const url = `http://chinbeker.picp.vip:5161/api/list/${route.params.path}`;
        const res = await top.webcore.http.get(url, {
            id: route.params.id
        }, 7200);

        if (res.code !== 200) {return false}

        // 渲染轮播图
        this.element.carousel.render({
            source: res.data.source,
            poster: res.data.carousel
        });

        // 列表信息
        this.element.infor.render({
            back: res.data.parent,
            title: res.data.title,
            desc: res.data.description,
        });


        this.value = res.data.songs

        if (!Array.isArray(this.value)) {return false;}

        // 渲染歌曲列表
        const doc = document.createDocumentFragment();
        let li = null;
        let song = null;

        for (let i = 0;i < this.value.length;i ++){
            song = this.value[i];
            song.order = i + 1;
            li = Element.createAll({
                tag: 'li',
                attrs: {"data-order": song.order},
                children: [
                    {
                        tag: 'img',
                        attrs: {
                            src: `${top.webcore.getConfig('cover')}/album/${song.cover}.jpg`,
                            loading: "lazy",
                            alt: '.'
                        }
                    },
                    {tag: 'p',text: song.title,},
                    {
                        tag: 'p',
                        children : [
                            {tag: 'span', text: song.artist},
                            {tag: 'span', text: ' - '},
                            {tag: 'span', text: song.album},
                        ]
                    },
                ]
            });
            doc.append(li);
            song = null;
            li = null;
        }

        // 添加空白项（flex响应式布局需要）
        for (let i = 0;i < 8;i ++){
            const empty = Element.create('li');
            doc.append(empty);
        }

        this.element.ol.append(doc);
    }


    async onBeforeRoute(route) {
        await this.render(route)
        return true;
    }
}
