import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import React from 'react';
import YAML from 'yamljs';

export class DataSlice extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectSlice = this.handleSelectSlice.bind(this);
  }

  handleSelectSlice(k, e) {
    this.props.selectSlice(k);
  }

  render() {
    let hasChildren = false;
    let onClick = undefined;
    let className = "data-plane";
    if (typeof this.props.sub_doc == 'object') {
      hasChildren = true;
    }

    if (hasChildren) {
      onClick = (e) => this.handleSelectSlice(this.props.sub_doc_key, e)
      className += " drillable";
    }

    const yAxis = { x: 0, y: 1, z: 0 };
    const styles = {
      height: window.innerHeight,
      transform: `translate3d(50%, ${this.props.translation.y}px, ${this.props.translation.z}px)`,
    };
    return (
      <div className={className} onClick={onClick} style={styles}>
        <div className="data-plane-key-name">
          {this.props.sub_doc_key}
        </div>
        <div className="data-plane-value">
          <SyntaxHighlighter language="yaml" style={synthwave84} >
            {YAML.stringify(this.props.sub_doc, 9999, 2)}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }
}

export default DataSlice;
