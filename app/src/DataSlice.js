import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import React from 'react';
import yaml from 'js-yaml';

export class DataSlice extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectSlice = this.handleSelectSlice.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleSelectSlice() {
    this.props.selectSlice(this.props.sub_doc_key, this.props.key_idx);
  }

  handleCopy(e) {
    e.stopPropagation();
    const yaml_to_copy = yaml.safeDump(this.props.sub_doc);
    console.log(yaml_to_copy);
    navigator.clipboard.writeText(yaml_to_copy);
  }

  render() {
    let hasChildren = false;
    const onClick = () => this.handleSelectSlice()
    let className = "data-plane";
    if (typeof this.props.sub_doc == 'object') {
      hasChildren = true;
    }

    if (hasChildren) {
      className += " drillable";
    }

    const styles = {
      maxHeight: window.screen.height * 0.6,
      transform: `translate3d(50%, ${this.props.translation.y}px, ${this.props.translation.z + this.props.translation.z_offset}px)`,
    };
    if (this.props.selected) {
      styles.transform += ` rotateY(45deg)`;
      className += " selected";
    }
    if (this.props.minimized) {
      styles.transform += ` translateX(-${window.screen.width * 0.5}px) translateZ(-${window.screen.width * 0.5}px) translateY(${window.screen.height*0.5}px)`;
    }
    return (
      <div className={className} onClick={onClick} style={styles}>
        <div className="data-plane-key-name">
          {this.props.sub_doc_key}
        </div>
        <div className="data-plane-copy" onClick={(e) => this.handleCopy(e)}>
          Copy
        </div>
        <div className="data-plane-value">
          <div className="data-plane-value-scroll-container" style={{maxHeight: `calc(${window.screen.height * 0.6}px - 2em)`}}>
            <SyntaxHighlighter language="yaml" style={synthwave84} >
              {yaml.safeDump(this.props.sub_doc)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    )
  }
}

export default DataSlice;
