/*
Data Structure for spritesheet assets

Example usage:
var sprites = new SpriteSheet({
    width: 32,
    height: 32,
    sprites: [
        { name: 'stand' },
        { name: 'walk_1', x: 0, y: 1 },
        { name: 'walk_2', x: 0, y: 1 },
    ]
});
*/

var SpriteSheet = function(data) {
    this._sprites = [];
    this._width = 0;
    this._height = 0;
    this._image = null;
 
    this.load(data);
};
 
SpriteSheet.prototype.load = function(data){
    this._height = data.height;
    this._width = data.width;
    this._sprites = data.sprites;
    this._image = data.image;
    this._cols = data.cols || 200;
    this._rows = data.rows || 1;
};


 
SpriteSheet.prototype.getOffset = function(spriteName) {
    //Go through all sprites to find the required one
    for(var i = 0; i < this._sprites.length; i++) {
        var sprite = this._sprites[i];

        if(sprite.name == spriteName) {
            //To get the offset, multiply by sprite width
            //Sprite-specific x and y offset is then added into it.
            return {
                image: this._image,
                x: ((i%this._cols) * this._width) + (sprite.x||0),
                y: (Math.floor(i/this._cols) * this._height) + (sprite.y||0),
                width: this._width,
                height: this._height
            };
        }
    }

    return null;
};

/*
Defines the Animation class that plays the sprite
Example of args.animation = [{spriteName:"walk_1",length:1},{spriteName:"walk_2",length:1}]
*/
var Animation = function(args){
    this.spriteSheet = args.spriteSheet;
    this.spriteAnimation = args.animation || [];
    this.frame = undefined;
    this.index = 0;
    this.elapsed = 0;
    this.loopFrame = args.loopFrame || false;

    this.repeat = args.repeat || false;
    this.keyFrame = args.keyFrame || 0;

    this.soundTriggers = args.soundTriggers || [];
    this.reset();
}

Animation.prototype.reset = function() {
    this.elapsed = 0;
    this.index = this.keyFrame;
    this.frame = this.spriteAnimation[this.index];
    this.speed = 1;
};

Animation.prototype.update = function(delta) {
    this.elapsed += delta;

    if(this.elapsed >= this.frame.length){
        this.index++;
        this.elapsed = Math.max(0,this.elapsed - this.frame.length);
    }

    if(this.index >= this.spriteAnimation.length*(1.0/this.speed)){
       if(this.repeat){
         if(this.loopFrame){    
             this.index = this.loopFrame;
         } else {
             this.index = this.keyFrame;
         }
       } else {
         this.index--;
       }
    }

    this.frame = this.spriteAnimation[this.index];
};

Animation.prototype.getIndex = function(){
    return this.index;
}

Animation.prototype.setSpeed = function(speed){
   this.speed = speed; 
}

Animation.prototype.render = function(ctx,x,y,scale,visibility){
    var info = this.spriteSheet.getOffset(this.frame.spriteName);
    ctx.globalAlpha = visibility;
    ctx.drawImage(info.image,info.x,info.y,info.width,info.height,x,y,info.width*scale,info.height*scale);
    ctx.globalAlpha = 1;
    var ind = this.index;
        // console.log("THIS "+ind);
    if(this.soundTriggers[this.index] instanceof Audio){
        this.soundTriggers[this.index].play();
    }
}