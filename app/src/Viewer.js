import React from 'react';
import DataSlice from './DataSlice.js';
import YAML from 'yamljs';
import _ from 'lodash';

export class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.selectSlice = this.selectSlice.bind(this);
    this.handleKeyRemoval = this.handleKeyRemoval.bind(this);
    this.moveCamera = this.moveCamera.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.setPositionToIndex = this.setPositionToIndex.bind(this);

    const example_yaml = `
---
software:
  author: Saltine
  about: Copy paste a YAML file into the browser :)
  controls: Scroll and click
  name: YAMLAMADINGDONG v420
  repo: https://github.com/msolters/yamlamadingdong
known issues:
- Can crash with sufficiently pathological input.`;

    this.state = {
      doc: YAML.parse(example_yaml),
      z_offset: window.innerWidth/4
    };

    // Get first key at first level of doc
    this.state.pos = [];
  }

  selectSlice(k) {
    this.setState({
      pos: this.state.pos.concat([k]),
      z_offset: window.innerWidth/4
    });
  }

  handleKeyRemoval() {
    this.setState({
      pos: this.state.pos.slice(0, this.state.pos.length-1)
    });
  }

  setPositionToIndex(idx) {
    this.setState({
      pos: this.state.pos.slice(0, idx)
    });
  }

  moveCamera(e) {
    const delta = e.deltaY;
    this.setState({
      z_offset: Math.max( Math.min((this.state.z_offset + delta), window.innerWidth), 0)
    });
  }

  onPaste(e) {
    let new_doc = undefined
    let exception = false
    try {
      new_doc = YAML.parse(e.clipboardData.getData('Text'));
    } catch(e) {
      exception = e;
    }
    if (new_doc === null || typeof new_doc !== "object" || exception) {
      new_doc = {
        "error": "Oh no! That didn't work for some reason.",
        "hints": [
          "This tool is designed for single YAML objects."
        ]
      }
      if (exception) {
        new_doc.exception = exception
      }
    }
    this.setState({
      doc: new_doc,
      z_offset: Object.keys(new_doc).length > 1 ? window.innerWidth/4 : window.innerWidth
    });
  }

  componentDidMount() {
    window.addEventListener("wheel", _.throttle(this.moveCamera, 200));
  }

  render() {
    let sub_doc = this.state.doc;
    for (const key of this.state.pos) {
      sub_doc = sub_doc[key];
    }

    const visible_keys = Object.keys(sub_doc);

    let data_slices = [];
    const x_partition = window.innerWidth / visible_keys.length;
    const y_partition = window.innerHeight*.5 / visible_keys.length;
    visible_keys.forEach((k, idx) => {
      const translation = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.75 - idx * y_partition,
        z: -(idx+1) * x_partition + this.state.z_offset
      };
      data_slices.push(
        <DataSlice key={k} translation={translation} sub_doc_key={k} sub_doc={sub_doc[k]} selectSlice={this.selectSlice} />
      )
    });

    let position_nodes = []
    this.state.pos.forEach((k, idx) => {
      position_nodes.push(
        <div className="nav-node" onClick={() => this.setPositionToIndex(idx+1)}>
          {k}
        </div>
      );
    });

    return (
      <div className="viewer" onPaste={(e) => this.onPaste(e)}>
        <div className="navbar">
          <div className="nav-node" onClick={() => this.setPositionToIndex(0)}>
            >
          </div>
          {position_nodes}
        </div>
        <div className="canvas">
          <div className="scene">
            {data_slices}
          </div>
        </div>
      </div>
    )
  }
}

export default Viewer;
