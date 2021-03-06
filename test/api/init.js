import ASS from '../../src/index.js';
import { $video, playVideo } from '../index.js';

describe('init API', () => {
  it('shoud initialize an ass instance', () => {
    const ass = new ASS('', $video);
    expect(ass._).to.be.an('object');
    expect(ass.container.classList.contains('ASS-container')).to.equal(true);
    expect(ass.video).to.equal($video);
    expect($video.parentNode).to.equal(ass.container);
    expect(ass.scale).to.be.an('number');
    ass.destroy();
  });

  it('requires source and video', () => {
    let ass = null;
    ass = new ASS();
    expect(ass._).to.equal(undefined);

    ass = new ASS({});
    expect(ass._).to.equal(undefined);

    // #19 allows to use fake video object
    // ass = new ASS('', document.createElement('div'));
    // expect(ass._).to.equal(undefined);
  });

  it('should support options.container', () => {
    const $container = document.createElement('div');
    const ass = new ASS('', $video, {
      container: $container,
    });
    expect(ass.container).to.equal($container);
    ass.destroy();
  });

  it('should support options.resampling', () => {
    const ass = new ASS('', $video, {
      container: document.createElement('div'),
      resampling: 'script_height',
    });
    expect(ass.resampling).to.equal('script_height');
    ass.destroy();
  });

  it('should autoplay if video is playing', function (done) {
    playVideo.call(this, $video).then(() => {
      const ass = new ASS('', $video);
      const handler = () => {
        expect(ass._.requestId).to.not.equal(0);
        ass.destroy();
        $video.removeEventListener('timeupdate', handler);
        done();
      };
      $video.addEventListener('timeupdate', handler);
    });
  });

  it('should work in Shadow DOM', function () {
    const $shadow = document.createElement('div');
    if (!($shadow.getRootNode) || !($shadow.attachShadow)) {
      this.skip();
      return;
    }
    const shadowRoot = $shadow.attachShadow({ mode: 'open' });
    const $v = document.createElement('video');
    shadowRoot.appendChild($v);
    document.body.appendChild($shadow);
    const ass = new ASS('', $v);
    expect(shadowRoot.querySelector('#ASS-global-style')).to.not.equal(undefined);
    ass.destroy();
    document.body.removeChild($shadow);
  });
});
