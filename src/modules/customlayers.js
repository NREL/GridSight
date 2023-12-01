
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {deck} from '@deck.gl/core'
import {PathStyleExtension} from '@deck.gl/extensions';


export class TransmissionLayer extends GeoJsonLayer {

    initializeState(){
        super.initializeState();

        console.log(this)
    }

  getShaders() {
    const shaders = super.getShaders();
    shaders.inject['vs:#decl'] += `\
  uniform float dashStart;`;
    shaders.inject['vs:#main-end'] += `\
  vDashOffset += dashStart;`;
    return shaders;
  }

  draw(opts) {
    opts.uniforms.dashStart = this.props.dashStart || 0;
    super.draw(opts);
  }
}

TransmissionLayer.defaultProps = {
  getDashStart: {type: 'accessor', value:0}
}