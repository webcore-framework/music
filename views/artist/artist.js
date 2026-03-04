export default class ArtistView extends webcore.component.builder {

    static tag = 'view-artist';

    create(){
        this.styles('/views/artist/artist.css')
        .template('/views/artist/artist.html')
        .mode('closed')
        .inject(['event', 'http'])
    }

    async onCreated(){
        const http = this.services.http;
        this.main = this.querySelector('main');

        this.api = http.create({
            url: '/api/artist',
            baseUrl: 'http://chinbeker.picp.vip:5161',
            cache: 7200
        });

        const res = await this.api.get();
        const data = res.data;

        this.render(data);
    }

    // 动态渲染方法
    render(data){
        if (!Object.isObject(data)){return false;}

        const summarys = [
            {name: "chinese", title: "华语"},
            {name: "english", title: "英语"},
            {name: "korean", title: "韩语"},
            {name: "japanese", title: "日语"},
            {name: "soundtrack", title: "纯音乐"}
        ];

        const doc = document.createDocumentFragment();
        for (const summary of summarys){
            const list = data[summary.name];
            if (Array.isArray(list) && list.length > 0){
                const details = Element.createAll({
                    tag: "details",
                    attrs: {open: "open"},
                    children: [
                        {tag: "summary", text: summary.title}
                    ]
                });

                const ol = document.createElement("ol");

                for (const item of list){
                    const li = Element.createAll({
                        tag: "li",
                        children: [
                            {
                                tag: "a",
                                attrs: {
                                    to: "songs",
                                    "data-params-path": "artist",
                                    "data-params-id": item.artistId
                                },
                                children: [
                                    {
                                        tag: "img",
                                        attrs: {
                                            src: `${top.webcore.getConfig('cover')}/artist/${item.avatar}.jpg`,
                                            // loading: "lazy",
                                            alt: "."
                                        }
                                    },
                                    {
                                        tag: "span",
                                        text: item.artistName
                                    }
                                ]
                            }
                        ]
                    });
                    ol.append(li);
                }

                // 添加空白li元素，适配flex响应式布局
                for (let i=0;i<8;i++){
                    ol.append(document.createElement("li"))
                }

                details.append(ol);
                doc.append(details);
            }
        }
        this.main.append(doc);
    }
}
