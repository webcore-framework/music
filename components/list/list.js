export default class List extends webcore.component.builder {

    static tag = 'app-list';

    // 创建空白组件
    create(){
        this.styles('/components/list/list.css')
        .template('')
        .mode('closed');
    }

    onCreated(){
        this.element = {
            ol: this.querySelector('ol'),
            last: this.querySelector('slot[name="last"]')
        };
    }

    // 动态渲染方法
    render(config){
        if (!Array.isArray(config)){return false;}

        const doc = document.createDocumentFragment();

        for (const sort of config){
            const list = sort.list;

            if (Array.isArray(list) && list.length > 0){
                const details = Element.createAll({
                    tag: "details",
                    attrs: {open: "open"},
                    children: [
                        {tag: "summary", text: sort.summary}
                    ]
                });
                const ol = sort.summary === "专辑" ? this.element.ol : document.createElement("ol");

                for (const item of list){
                    const li = Element.createAll({
                        tag: "li",
                        children: [
                            {
                                tag: "a",
                                attrs: {
                                    to: "songs",
                                    "data-params-path": sort.path,
                                    "data-params-id": item[sort.id]
                                },
                                children: [
                                    {
                                        tag: "img",
                                        attrs: {
                                            src: `${top.webcore.getConfig('cover')}/${sort.image}/${item[sort.cover]}.jpg`,
                                            alt: "."
                                        }
                                    },
                                    {
                                        tag: "span",
                                        text: item[sort.title]
                                    }
                                ]
                            }
                        ]
                    });
                    if (sort.summary === "专辑"){
                        this.element.last.before(li)
                    } else {
                        ol.append(li);
                    }
                }

                // 添加空白li元素，适配flex响应式布局
                for (let i = 0;i < 8;i ++){
                    ol.append(document.createElement("li"))
                }

                if (sort.summary !== "专辑"){
                    details.append(ol);
                    doc.append(details);
                }
            }
        }

        // 给所有 a 标签绑定路由
        top.webcore.router.bind(this.element.ol);
        top.webcore.router.bind(doc);

        this.root.append(doc);
    }
}
