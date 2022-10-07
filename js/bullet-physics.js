/*
      Copyright 2021. Futurewei Technologies Inc. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at
        http:  www.apache.org/licenses/LICENSE-2.0
      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      See the License for the specific language governing permissions and
      limitations under the License.
*/
/**
@brief Bullet Physics

*/
WL.registerComponent('bullet-physics', {
    speed: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        this.dir = new Float32Array(3);
        this.time = 0;
        this.position = [0, 0, 0];

        this.object.getTranslationWorld(this.position);
        // console.log("init >> this.position >> ", this.position);

        this.collision = this.object.getComponent('collision', 0);
        if(!this.collision) {
            console.warn("'bullet-physics' component on object", this.object.name, "requires a collision component");
        }
    },

    start: function() {
        // this.targetObject.scale([0.2, 0.2, 0.2]);
        // this.object.scale([0.2, 0.2, 0.2]);
    },

    update: function(dt) {
        if(isNaN(dt)){
            console.log("dt is NaN");
            return;
        } 

        this.time += dt;

        this.object.getTranslationWorld(this.position);
        console.log("update >> this.position >> ", this.position);
        if(this.position[1] <= floorHeight + this.collision.extents[0]) {
            console.log("bullet penetrated floor >> "+this.position[1]+" <= "+floorHeight + this.collision.extents[0]
            + " ( " + floorHeight, ", ", this.collision.extents[0]," )");
            this.active = false;
            return;
        }

        glMatrix.vec3.scale(this.dir, this.dir, this.speed*this.time);

        glMatrix.vec3.add(this.position, this.position, this.dir);
        
        this.object.resetTranslation();
        // glMatrix.vec3.lerp(this.position, this.pointA, this.pointB, this.time-moveDuration/2);
        console.log("this.position >> "+ this.position, ", ", this.speed*this.time);
        this.object.translate(this.position);
    },
});
