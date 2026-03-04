export default class SidbarPanel extends webcore.component.builder {
    static tag = 'app-sidbar';

    create(){
        this.template(
`<section>
    <h2>媒体库</h2>
    <ol>
        <li><a to="/style" replace><i class="icon"><span class="style"></span></i><span>所有歌曲</span></a></li>
        <li><a to="/artist" replace><i class="icon"><span class="artist"></span></i><span>艺术家</span></a></li>
        <li><a to="/album" replace><i class="icon"><span class="album"></span></i><span>专辑</span></a></li>
        <li><a to="/favorite" replace><i class="icon"><span class="like"></span></i><span>收藏</span></a></li>
    </ol>
</section>
<section>
    <h2>分类</h2>
    <ol>
        <li><a to="chinese" replace><i class="icon"><span class="sheet"></span></i><span>华语</span></a></li>
        <li><a to="cantonese" replace><i class="icon"><span class="sheet"></span></i><span>粤语</span></a></li>
        <li><a to="english" replace><i class="icon"><span class="sheet"></span></i><span>英语</span></a></li>
        <li><a to="electric" replace><i class="icon"><span class="sheet"></span></i><span>电音</span></a></li>
        <li><a to="classic" replace><i class="icon"><span class="sheet"></span></i><span>老歌</span></a></li>
        <li><a to="national" replace><i class="icon"><span class="sheet"></span></i><span>民族</span></a></li>
        <li><a to="country" replace><i class="icon"><span class="sheet"></span></i><span>祖国</span></a></li>
        <li><a to="soundtrack" replace><i class="icon"><span class="sheet"></span></i><span>纯音乐</span></a></li>
    </ol>
</section>`
        ).styles('/components/panel/sidbar/sidbar.css')
        .mode('closed')

    }
}
