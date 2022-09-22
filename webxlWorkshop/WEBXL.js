(async function() {
  const isArSessionSupported =
      navigator.xr &&
      navigator.xr.isSessionSupported &&
      await navigator.xr.isSessionSupported("immersive-ar");
  if (isArSessionSupported) { //I need to create element in the html
    document.getElementById("enter-ar").addEventListener("click", ()=>activateXR())
  } else {
    console.log("No soporta RA")
  }
})();

const activateXR = async () => {
  try {
    /** Initialize a WebXR session using "immersive-ar". */
    // xrSession = await navigator.xr.requestSession("immersive-ar");
    /** Alternatively, initialize a WebXR session using extra required features. */
       let xrSession = await navigator.xr.requestSession("immersive-ar", {
       requiredFeatures: ['hit-test', 'dom-overlay'],
       domOverlay: { root: document.body }
     });
     console.log(xrSession);

    /** Create the canvas that will contain our camera's background and our virtual scene. */
    createXRCanvas(xrSession);

    /** With everything set up, start the app. */
    onSessionStarted(xrSession);
  } catch(e) {
    console.log(e);
    console.log("No se puede activar !!!")
}
}
const createXRCanvas=(xrSession)=> {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  let gl = canvas.getContext("webgl", {xrCompatible: true});
  
  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession, gl)
  });
}

const onSessionStarted = async (xrSession) => {
  /** To help with working with 3D on the web, we'll use three.js. */
  setupThreeJs();

  /** Start a rendering loop using onXRFrame. */
  xrSession.requestAnimationFrame(onXRFrame);

  xrSession.addEventListener("select", onSelect());
}

const setupThreeJs=()=> {
  /** To help with working with 3D on the web, we'll use three.js.
   * Set up the WebGLRenderer, which handles rendering to our session's base layer. */
  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canvas: this.canvas,
    context: this.gl
  });
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /** Initialize our demo scene. */
  //this.scene = Demo createCubeScene();
  let scene = DemoUtils.createLitScene();
  let reticle = new Reticle();
  scene.add(reticle);

  /** We'll update the camera matrices directly from API, so
   * disable matrix auto updates so three.js doesn't attempt
   * to handle the matrices independently. */
  let camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;
}

const onXRFrame = (time, frame,xrSession) => {
/** Create another XRReferenceSpace that has the viewer as the origin. */
let viewerSpace = xrSession.requestReferenceSpace('viewer');

/** Perform hit testing using the viewer as origin. */
let hitTestSource = xrSession.requestHitTestSource({
  space: viewerSpace 
  });
  
    /** Setup an XRReferenceSpace using the "local" coordinate system. */
 let localReferenceSpace =xrSession.requestReferenceSpace('local');
  
  /** Queue up the next draw request. */
  xrSession.requestAnimationFrame(onXRFrame());

  /** Bind the graphics framebuffer to the baseLayer's framebuffer. */
  const framebuffer = xrSession.renderState.baseLayer.framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  renderer.setFramebuffer(framebuffer);

  /** Retrieve the pose of the device.
   * XRFrame.getViewerPose can return null while the session attempts to establish tracking. */
  const pose = frame.getViewerPose(localReferenceSpace);
  if (pose) {
  //   /** In mobile AR, we only have one view. */
      const view = pose.views[0];
  //
  const viewport = xrSession.renderState.baseLayer.getViewport(view);
  renderer.setSize(viewport.width, viewport.height)
  //
  //   /** Use the view's transform matrix and projection matrix to configure the THREE.camera. */
  camera.matrix.fromArray(view.transform.matrix)
  camera.projectionMatrix.fromArray(view.projectionMatrix);
  camera.updateMatrixWorld(true);
  //
  //   /** Conduct hit test. */
      const hitTestResults = frame.getHitTestResults(hitTestSource);
  //
  //   /** If we have results, consider the environment stabilized. */
      if (!stabilized && hitTestResults.length > 0) {
        stabilized = true;
        document.body.classList.add('stabilized');
      }
      if (hitTestResults.length > 0) {
        const hitPose = hitTestResults[0].getPose(localReferenceSpace);
  //
  //     /** Update the reticle position. */
      reticle.visible = true;
      reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
      reticle.updateMatrixWorld(true);
      }
  //   /** Render the scene with THREE.WebGLRenderer. */
  renderer.render(scene, camera)
  }
}

// /** Place a sunflower when the screen is tapped. */
const onSelect = () => {
  if (window.sunflower) {
    const clone = window.sunflower.clone();
    clone.position.copy(reticle.position);
    scene.add(clone)

    const shadowMesh = scene.children.find(c => c.name === 'shadowMesh');
    shadowMesh.position.y = clone.position.y;
  }
}
// /**
//  * Called on the XRSession's requestAnimationFrame.
//  * Called with the time and XRPresentationFrame.
//  */


// /**
//      * Initialize three.js specific rendering code, including a WebGLRenderer,
//      * a demo scene, and a camera for viewing the 3D content.
//      */


