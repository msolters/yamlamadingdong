import React from 'react';
import DataSlice from './DataSlice.js';
import yaml from 'js-yaml';
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
  name: YAMLAMADINGDONG v420
  author: Saltine
  about: Copy paste a YAML file into the browser :)
  controls: Scroll and click
  repo: https://github.com/msolters/yamlamadingdong
getting started:
- COPY the provided yaml file
- Or any YAML file
- Paste it here!
yaml:
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
    const delta = Math.max(e.deltaY, Math.sign(e.deltaY)*110);
    this.setState({
      z_offset: Math.max( Math.min((this.state.z_offset + delta), window.innerWidth), 0)
    });
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
        console.log(exception);
        new_doc.exception = exception;
      }
    }
    this.setState({
      doc: new_doc,
      z_offset: Object.keys(new_doc).length > 1 ? window.innerWidth/4 : window.innerWidth
    });
  }

  componentDidMount() {
    window.addEventListener("wheel", _.throttle(this.moveCamera, 70));
  }

  render() {
    let sub_doc = this.state.doc;
    for (const key of this.state.pos) {
      sub_doc = sub_doc[key];
    }

    const visible_keys = Object.keys(sub_doc);

    let data_slices = [];
    const x_partition = window.innerWidth / visible_keys.length;
    const y_partition = window.innerHeight*.4 / visible_keys.length;
    visible_keys.forEach((k, idx) => {
      const translation = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.6 - idx * y_partition,
        z: -(idx+1) * x_partition + this.state.z_offset
      };
      data_slices.push(
        <DataSlice key={k} translation={translation} sub_doc_key={k} sub_doc={sub_doc[k]} selectSlice={this.selectSlice} />
      )
    });

    let position_nodes = []
    this.state.pos.forEach((k, idx) => {
      position_nodes.push(
        <div key={idx} className="nav-node" onClick={() => this.setPositionToIndex(idx+1)}>
          {k}
        </div>
      );
    });

    return (
      <div className="viewer" onPaste={(e) => this.onPaste(e)}>
        <div className="navbar">
          <div className="nav-node" onClick={() => this.setPositionToIndex(0)}>
            Keys >
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
