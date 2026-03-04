export default class HomeView extends webcore.component.builder {

    static tag = 'view-home';

    create(){
        this.template(
`<section>
    <h2>媒体库</h2>
    <ol>
        <li><a to="/style"><i class="style"></i><span>所有歌曲</span></a></li>
        <li><a to="/artist"><i class="artist"></i><span>艺术家</span></a></li>
        <li><a to="/album"><i class="album"></i><span>专辑</span></a></li>
        <li><a to="/favorite"><i class="like"></i><span>收藏</span></a></li>
    </ol>
</section>
<section>
    <h2>分类</h2>
    <ol>
        <li><a to="chinese"><i class="sheet"></i><span>华语</span></a></li>
        <li><a to="cantonese"><i class="sheet"></i><span>粤语</span></a></li>
        <li><a to="english"><i class="sheet"></i><span>英语</span></a></li>
        <li><a to="electric"><i class="sheet"></i><span>电音</span></a></li>
        <li><a to="classic"><i class="sheet"></i><span>老歌</span></a></li>
        <li><a to="national"><i class="sheet"></i><span>民族</span></a></li>
        <li><a to="country"><i class="sheet"></i><span>祖国</span></a></li>
        <li><a to="soundtrack"><i class="sheet"></i><span>纯音乐</span></a></li>
    </ol>
</section>`)
        .styles('/views/home/home.css')
        .mode('closed')
    }

}
