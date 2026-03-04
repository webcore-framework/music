export default class StyleView extends webcore.component.builder {

    static tag = 'view-style';

    create(){
        this.template('/views/style/style.html')
        .styles('/views/style/style.css')
        .mode('closed')
        .inject(['http'])
    }

    onCreated() {
        this.element = {
            ol: this.querySelector('ol')
        };

        this.api = this.services.http.create({
            url: '/api/style',
            baseUrl: 'http://chinbeker.picp.vip:5161',
            cache: 7200
        });

        this.render()
    }

    async render() {
        const res = await this.api.get();

        if (res.code !== 200) {return false}

        if (Array.isArray(res.data)) {
            const doc = document.createDocumentFragment();
            let li = null;
            for (const style of res.data) {
                li = Element.createAll({
                    tag: 'li',
                    children: [
                        {
                            tag: 'a',
                            attrs: {
                                to: 'songs',
                                "data-params-path": "style",
                                "data-params-id": style.styleId
                            },
                            children: [
                                {
                                    tag: 'img',
                                    attrs: {
                                        src: `${top.webcore.getConfig('cover')}/folder/${style.cover}.jpg`,
                                        alt: '.'
                                    }
                                },
                                {
                                    tag: 'span',
                                    text: style.styleShort
                                }
                            ]
                        }
                    ]
                });
                doc.append(li);
                li = null;
            }


            for (let i = 0; i < 8; i++) {
                doc.append(document.createElement("li"))
            }
            top.webcore.router.bind(doc);
            this.element.ol.append(doc);
        }
    }
}
