export default class EnglishView extends webcore.component.builder {

    static tag = 'view-english';

    create(){
        this.styles(':host{display:block}.root{position:relative}')
        .template('/views/english/english.html')
        .mode('closed')
        .inject(['http']);
    }

    async onCreated(){
        this.element = {
            main: this.querySelector('app-list'),
            details: this.querySelector('details'),
            ol: this.querySelector('ol')
        };
        const http = this.services.http;

        this.api = http.create({
            url: '/api/sort/english',
            baseUrl: 'http://chinbeker.picp.vip:5161',
            cache: 7200
        });

        const res = await this.api.get();
        if (res.success){this.render(res.data);}
    }

    render(data){
        if (!Object.isObject(data)){return false;}

        const details = this.element.details;
        const ol = this.element.ol;

        const albums = {
            summary: "专辑",
            path: "sort",
            id: "sortId",
            image: "album",
            cover: "cover",
            title: "name",
            list: data.albums
        };
        const list = albums.list;
        if (Array.isArray(list) && list.length > 0){
            for (const item of list){
                const li = Element.createAll({
                    tag: "li",
                    children: [
                        {
                            tag: "a",
                            attrs: {
                                to: "songs",
                                "data-params-path": albums.path,
                                "data-params-id": item[albums.id]
                            },
                            children: [
                                {
                                    tag: "img",
                                    attrs: {
                                        src: `${top.webcore.getConfig('cover')}/${albums.image}/${item[albums.cover]}.jpg`,
                                        alt: "."
                                    }
                                },
                                {
                                    tag: "span",
                                    text: item[albums.title]
                                }
                            ]
                        }
                    ]
                });
                ol.append(li);
            }
        }
        // 添加空白li元素，适配flex响应式布局
        for (let i=0;i<8;i++){
            ol.append(document.createElement("li"))
        }

        details.append(ol);
        top.webcore.router.bind(details);
        this.element.main.root.append(details);

        const config = [
            {
                summary: "风格",
                path: "sort",
                id: "sortId",
                image: "album",
                cover: "cover",
                title: "name",
                list: data.styles
            },
            {
                summary: "声音",
                path: "sing",
                id: "sortId",
                image: "album",
                cover: "cover",
                title: "name",
                list: data.sounds
            },
            {
                summary: "歌手",
                path: "artist",
                id: "artistId",
                image: "artist",
                cover: "avatar",
                title: "artistName",
                list: data.artists
            },
        ];
        this.element.main.render(config);
        return false;
    }
}
