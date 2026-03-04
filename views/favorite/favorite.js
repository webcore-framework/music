export default class FavoriteView extends webcore.component.builder {

    static tag = 'view-favorite';

    create(){
        this.template('/views/favorite/favorite.html')
        .styles(':host{display:block}.root{position:relative}')
        .mode('closed')
    }

    onCreated(){
    }

}
