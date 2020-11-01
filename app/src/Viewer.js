import React from 'react';
import DataSlice from './DataSlice.js';
import yaml from 'js-yaml';
import _ from 'lodash';

function hasClass(element, className) {
  do {
    if (element.classList && element.classList.contains(className)) {
      return true;
    }
    element = element.parentNode;
  } while (element);
  return false;
}

export class Viewer extends React.Component {
  componentDidMount() {
    document.getElementsByClassName("backdrop")[0].addEventListener("click", (e) => {
      this.deselect();
    });
    window.addEventListener("wheel", this.moveCameraScroll);
    window.addEventListener("touchmove", _.throttle(this.moveCameraTouch, 30));
    window.addEventListener("touchstart", this.handleStartTouch);
    window.addEventListener("keydown", this.handleKeydown);
  }

  constructor(props) {
    super(props);
    this.selectSlice = this.selectSlice.bind(this);
    this.moveCameraScroll = this.moveCameraScroll.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleStartTouch = this.handleStartTouch.bind(this);
    this.moveCameraTouch = this.moveCameraTouch.bind(this);
    this.setZOffset = this.setZOffset.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.setPositionToIndex = this.setPositionToIndex.bind(this);


    const example_yaml = `
---
what do?:
  Purpose:
    Browse YAML and JSON in 3D
  How to Use:
    - Paste YAML or JSON from your clipboard to anywhere in the browser window
  Navigation Controls:
    Keyboard:
    - Left/Right Arrow Keys to navigate document nodes
    - Enter Key will view open node in detail view
    - Enter Key a second time will drill down into that node if it has children
    - Similarly, Escape Key can be used to travel upwards
    Mouse:
    - Scroll to navigate document nodes
    - Left click === Enter
    - Clicking on the background will deselect a node
    - Top navbar on can be used to travel upwards
notes:
- (Mostly) desktop only for now!
about:
  name: YAMLAMADINGDONG v420
  author: Saltine
  function: Browse artisanal, ethically-sourced YAML or JSON in 3D
  repo: https://github.com/msolters/yamlamadingdong
example yaml:
  kind: Deployment
  apiVersion: apps/v1
  metadata:
    name: yamlamadingdong
    namespace: default
    selfLink: /apis/apps/v1/namespaces/default/deployments/yamlamadingdong
    uid: c190b22c-1a76-11eb-985d-42010a8001c6
    resourceVersion: '149303278'
    generation: 8
    creationTimestamp: '2020-10-30T06:11:32Z'
    labels:
      app.kubernetes.io/managed-by: skaffold-v0.35.0
      role: yamlamadingdong
      skaffold.dev/builder: google-cloud-build
      skaffold.dev/cleanup: 'true'
      skaffold.dev/deployer: kustomize
      skaffold.dev/tag-policy: envTemplateTagger
      skaffold.dev/tail: 'true'
    annotations:
      deployment.kubernetes.io/revision: '8'
      kubectl.kubernetes.io/last-applied-configuration: >
        {"apiVersion":"extensions/v1beta1","kind":"Deployment","metadata":{"annotations":{},"labels":{"app.kubernetes.io/managed-by":"skaffold-v0.35.0","role":"yamlamadingdong","skaffold.dev/builder":"google-cloud-build","skaffold.dev/cleanup":"true","skaffold.dev/deployer":"kustomize","skaffold.dev/tag-policy":"envTemplateTagger","skaffold.dev/tail":"true"},"name":"yamlamadingdong","namespace":"default"},"spec":{"replicas":1,"selector":{"matchLabels":{"role":"yamlamadingdong"}},"strategy":{"rollingUpdate":{"maxSurge":2,"maxUnavailable":1},"type":"RollingUpdate"},"template":{"metadata":{"labels":{"app.kubernetes.io/managed-by":"skaffold-v0.35.0","role":"yamlamadingdong","skaffold.dev/builder":"google-cloud-build","skaffold.dev/cleanup":"true","skaffold.dev/deployer":"kustomize","skaffold.dev/tag-policy":"envTemplateTagger","skaffold.dev/tail":"true"}},"spec":{"containers":[{"image":"gcr.io/gcp-project-id/yamlamadingdong:118c447","imagePullPolicy":"Always","name":"yamlamadingdong"},{"image":"gcr.io/gcp-project-id/auto-ssl:master","imagePullPolicy":"Always","name":"nginx","ports":[{"containerPort":80,"name":"http","protocol":"TCP"},{"containerPort":443,"name":"https","protocol":"TCP"}],"resources":{"limits":{"cpu":"250m","memory":"275Mi"},"requests":{"cpu":"100m","memory":"90Mi"}},"volumeMounts":[{"mountPath":"/usr/local/openresty/nginx/conf","name":"nginx-config"}]}],"volumes":[{"configMap":{"name":"yamlamadingdong-nginx"},"name":"nginx-config"}]}}}}
  spec:
    replicas: 1
    selector:
      matchLabels:
        role: yamlamadingdong
    template:
      metadata:
        creationTimestamp: null
        labels:
          app.kubernetes.io/managed-by: skaffold-v0.35.0
          role: yamlamadingdong
          skaffold.dev/builder: google-cloud-build
          skaffold.dev/cleanup: 'true'
          skaffold.dev/deployer: kustomize
          skaffold.dev/tag-policy: envTemplateTagger
          skaffold.dev/tail: 'true'
      spec:
        volumes:
          - name: nginx-config
            configMap:
              name: yamlamadingdong-nginx
              defaultMode: 420
        containers:
          - name: yamlamadingdong
            image: 'gcr.io/gcp-project-id/yamlamadingdong:118c447'
            resources: {}
            terminationMessagePath: /dev/termination-log
            terminationMessagePolicy: File
            imagePullPolicy: Always
          - name: nginx
            image: 'gcr.io/gcp-project-id/auto-ssl:master'
            ports:
              - name: http
                containerPort: 80
                protocol: TCP
              - name: https
                containerPort: 443
                protocol: TCP
            resources:
              limits:
                cpu: 250m
                memory: 275Mi
              requests:
                cpu: 100m
                memory: 90Mi
            volumeMounts:
              - name: nginx-config
                mountPath: /usr/local/openresty/nginx/conf
            terminationMessagePath: /dev/termination-log
            terminationMessagePolicy: File
            imagePullPolicy: Always
        restartPolicy: Always
        terminationGracePeriodSeconds: 30
        dnsPolicy: ClusterFirst
        securityContext: {}
        schedulerName: default-scheduler
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxUnavailable: 1
        maxSurge: 2
    revisionHistoryLimit: 2147483647
    progressDeadlineSeconds: 2147483647
  status:
    observedGeneration: 8
    replicas: 1
    updatedReplicas: 1
    readyReplicas: 1
    availableReplicas: 1
    conditions:
      - type: Available
        status: 'True'
        lastUpdateTime: '2020-10-30T06:11:32Z'
        lastTransitionTime: '2020-10-30T06:11:32Z'
        reason: MinimumReplicasAvailable
        message: Deployment has minimum availability.
`;

    this.state = {
      doc: yaml.safeLoad(example_yaml),
      selected: {
        idx: 0
      },
      z_offset: 0
    };

    // Get first key at first level of doc
    this.state.pos = [];

    this.touch_start = {x: 0, y: 0};
    this.current_scroll_velocity = 0;
    this.scroll_active = false;
    this.last_scroll = new Date().getTime();
  }

  deselect() {
    this.old_idx = this.state.selected.idx;
    this.setState({
      selected: {
        idx: undefined
      }
    });
  }

  drillToSlice(k) {
    this.old_idx = undefined;
    this.setState({
      pos: this.state.pos.concat([k]),
      selected: {
        idx: 0
      },
      z_offset: window.screen.width * 0.1
    });
  }

  handleKeydown(e) {
    if (this.state.selected.idx !== undefined) {
      switch (e.key) {
        case "ArrowLeft":
          if (this.state.selected.idx > 0) {
            const new_idx = Math.max(this.state.selected.idx - 1, 0);
            this.selectSlice(this.data_plane_cfg[new_idx].key, new_idx);
          }
          break;
        case "ArrowRight":
          if (this.state.selected.idx < Object.keys(this.sub_doc).length - 1) {
            const new_idx = Math.min(this.state.selected.idx + 1, Object.keys(this.sub_doc).length - 1);
            this.selectSlice(this.data_plane_cfg[new_idx].key, new_idx);
          }
          break;
        case "Enter":
          const new_key = this.data_plane_cfg[this.state.selected.idx].key;
          const has_children = typeof this.sub_doc[ new_key ] == "object";
          if (has_children) {
            this.drillToSlice(new_key);
          }
          break;
        case "Escape":
          this.deselect()
          break;
      }
    } else {
        switch (e.key) {
          case "ArrowLeft":
          case "ArrowRight":
          case "Enter":
            const new_idx = this.old_idx ? this.old_idx : 0;
            this.selectSlice(this.data_plane_cfg[new_idx].key, new_idx);
            break;
          case "Escape":
            this.setPositionToIndex(this.state.pos.length - 1);
            break;
      }
    }
  }

  handleStartTouch(e) {
    this.touch_start = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
  }

  moveCameraScroll(e) {
    const update_period = 50;
    const max_velocity = window.screen.width / this.data_plane_cfg.length;
    let direction = Math.sign(e.deltaY);
    if (this.scroll_active) {
      this.current_scroll_velocity += direction * max_velocity * 0.2;
      this.current_scroll_velocity = Math.max(-150, Math.min(150, this.current_scroll_velocity));
    } else {
      this.scroll_active = true;
      this.current_scroll_velocity = 0;
      this.scroll_timer = setInterval(() => {
        const now = new Date().getTime();
        this.setZOffset(Math.max( Math.min((this.state.z_offset + this.current_scroll_velocity), window.innerWidth), 0), e)
        if (now - this.last_scroll > update_period) {
          this.current_scroll_velocity /= 2;
          if (Math.abs(this.current_scroll_velocity) < 1) {
            this.current_scroll_velocity = 0;
            this.scroll_active = false;
            clearInterval(this.scroll_timer);
          }
        }
      }, update_period);
    }
    this.last_scroll = new Date().getTime();
  }

  moveCameraTouch(e) {
    const delta = e.touches[0].pageY - this.touch_start.y;
    this.setZOffset(Math.max( Math.min((this.state.z_offset + delta), window.innerWidth), 0), e);
  }

  onPaste(e) {
    this.setState({
      doc: {
        "loading": "Parsing..."
      },
      z_offset: window.innerWidth
    });
    let new_doc = undefined;
    let exception = false;
    let multi_doc = false
    const input_text = e.clipboardData.getData('Text');
    try {
      new_doc = yaml.safeLoad(input_text);
    } catch(e) {
      if (e.message === "expected a single document in the stream, but found more") {
        multi_doc = true;
      }
      exception = e;
    }
    if (multi_doc) {
      try {
        new_doc = yaml.safeLoadAll(input_text);
        exception = false
      } catch(e) {
        exception = e;
      }
    }
    if (new_doc === null || typeof new_doc !== "object" || exception) {
      new_doc = {
        "error": "Oh no! That didn't work for some reason.",
      };
      if (exception !== false) {
        new_doc.exception = exception;
      }
    }
    this.old_idx = undefined;
    this.setState({
      doc: new_doc,
      z_offset: window.screen.width * 0.1,
      selected: {
        idx: undefined
      }
    });
  }

  selectSlice(k, idx) {
    if (this.state.selected.idx === idx) {
      // Selecting an already selected card drills into it
      this.drillToSlice(k);
      return;
    }
    this.setState({
      selected: {
        idx: idx
      },
      z_offset: -0.75 * this.data_plane_cfg[idx].translation.z
    });
  }

  setPositionToIndex(idx) {
    this.setState({
      pos: this.state.pos.slice(0, idx),
      z_offset: window.screen.width * 0.1
    });
  }

  setZOffset(z_offset, e) {
    if (! (hasClass(e.srcElement, "data-plane") && this.state.selected.idx !== undefined)) {
      const new_state = {
        z_offset: z_offset
      };
      if (this.state.selected.idx !== undefined) {
        this.deselect();
      }
      this.setState(new_state);
    }
  }



  render() {
    let sub_doc = this.state.doc;
    for (const key of this.state.pos) {
      sub_doc = sub_doc[key];
    }
    this.sub_doc = sub_doc

    const visible_keys = Object.keys(sub_doc);

    // Generate config: 3D math, select states, etc.
    const x_partition = window.screen.width / visible_keys.length;
    const y_partition = window.screen.height * 0.3 / visible_keys.length;
    const z_falloff_threshold = 0.0;
    const data_plane_cfg = [];
    let data_slices = [];
    visible_keys.forEach((k, idx) => {
      let y_offset = 0;
      const translation = {
        x: window.innerWidth * 0.5,
        y: 0,
        z: -(idx+1) * x_partition,
        z_offset: this.state.z_offset
      };
      const isMinimized = this.state.selected.idx !== undefined && this.state.selected.idx !== idx;
      const isSelected =  this.state.selected.idx === idx;
      if (!isMinimized && !isSelected) {
        translation.y += window.screen.height * 0.3 - idx * y_partition;
        let z = translation.z + translation.z_offset;
        if (z > z_falloff_threshold * window.screen.width) {
          translation.y += z - z_falloff_threshold * window.screen.width;
        }
      }
      data_plane_cfg.push({
        key: k,
        idx: idx,
        selected: isSelected,
        minimized: isMinimized,
        translation: translation
      });
    });

    this.data_plane_cfg = data_plane_cfg;

    // Render data planes
    data_plane_cfg.forEach((cfg) => {
      data_slices.push(
        <DataSlice key={cfg.key} key_idx={cfg.idx} selected={cfg.selected} minimized={cfg.minimized} translation={cfg.translation} sub_doc_key={cfg.key} sub_doc={sub_doc[cfg.key]} selectSlice={this.selectSlice} />
      )
    });

    // Render nav bar
    let position_nodes = []
    this.state.pos.forEach((k, idx) => {
      position_nodes.push(
        <div key={idx} className="nav-node" onClick={() => this.setPositionToIndex(idx+1)}>
          {k}
        </div>
      );
    });

    const scene_styles = {
      transform: `rotateY(-45deg) translateY(12em) translateX(-50%)`,
    };

    return (
      <div className="viewer" onPaste={(e) => this.onPaste(e)}>
        <div className="backdrop"></div>
        <div className="navbar">
          <div className="nav-node" onClick={() => this.setPositionToIndex(0)}>
            Keys >
          </div>
          {position_nodes}
        </div>
        <div className="canvas">
          <div className="scene" style={scene_styles}>
            {data_slices}
          </div>
        </div>
      </div>
    )
  }
}

export default Viewer;
