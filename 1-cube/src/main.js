import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

function init() {
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
    antialias: true, // 계단 현상을 없앨 수 있다.
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 화면에 출력
  document.body.appendChild(renderer.domElement);

  // scene 추가
  const scene = new THREE.Scene();

  // camera 추가
  // fov, 종횡비, near, far
  // https://threejs.org/manual/#en/fundamentals PerspectiveCamera부분 참고 - 이미지 있음
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

  // 드래그시 카메라의 위치가 mesh 주변을 궤도를 그리면서 빙글빙글 돈다. (mesh 위치 움직임 x)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true; // 드래그 하지 않아도 자동으로 돌아간다.
  // controls.autoRotateSpeed = 30; // 속도 조절
  controls.enableDamping = true; // 드래그를 멈추는 순간 회전이 바로 멈추지 않고 관성을 유지한다.
  // controls.dampingFactor = 0.01; // 관성의 값을 조절할 수 있다.
  // controls.enableZoom = true; // 카메라 zoom 가능
  // controls.enablePan = true; // 카메라 panning 가능
  // controls.maxDistance = 50; // 최대거리 설정 가능
  // controls.minDistance = 10; // 최소거리 설정 가능
  // controls.maxPolarAngle = Math.PI / 2; // 수직 최대각도 설정 가능
  // controls.minPolarAngle = Math.PI / 3; // 수직 최소각도 설정 가능
  // controls.maxAzimuthAngle = Math.PI / 2; // 수평 최대각도 설정 가능
  // controls.minAzimuthAngle = Math.PI / 3; // 수평 최소각도 설정 가능

  // const geometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeGeometry = new THREE.IcosahedronGeometry(1);
  const skeletonGeometry = new THREE.IcosahedronGeometry(2);

  // ThreeJS 홈페이지에 살펴보면 다양한 Material이 많으므로 살펴볼 것
  // 조명에 영향을 받지 않는 BasicMaterial
  // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff });
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x00ffff),
    emissive: 0x111111,
    // transparent: true,
    // opacity: 0.5,
    // visible: true,
    // wireframe: true,
    // side: THREE.DoubleSide,
  });
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color: 0xaaaaaa,
  });

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

  scene.add(cube);
  scene.add(skeleton);

  // camera.position.set(3, 4, 5);
  camera.position.z = 5;

  // 카메라가 큐브의 위치를 바라보게 해준다.
  // camera.lookAt(cube.position);

  const directionalLignt = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLignt.position.set(-1, 2, 3);
  scene.add(directionalLignt);

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  // ambientLight.position.set(3, 2, 1);
  // scene.add(ambientLight);

  const clock = new THREE.Clock();
  function render() {
    // cube.rotation.x += 0.01; // 0.01 radian 만큼씩

    // 모든 사용자에게 같은 애니메이션 제공하기

    // 방법 1.
    // 컴퓨터마다 render 함수 호출 횟수는 다르겠지만
    // 시간으로 따져서 1초마다 각도를 변경시킨다면
    // 모든 사용자에게 같은 속도로 돌아가는 cube 애니메이션을 제공할 수 있다.
    // cube.rotation.x = Date.now() / 1000;

    // 방법 2.
    // ThreeJS 에서 제공하는 Clock 사용하기.
    // Clock 인스턴스가 생성된 시점부터 경과한 시간을 초단위로 반환한다.
    cube.rotation.x = clock.getElapsedTime();
    cube.rotation.y = clock.getElapsedTime();

    skeleton.rotation.x = clock.getElapsedTime() * -1.5;
    skeleton.rotation.y = clock.getElapsedTime() * -1.5;

    // cube.position.y = Math.sin(cube.rotation.x);
    // cube.scale.x = Math.cos(cube.rotation.x);

    // cube.rotation.x = THREE.MathUtils.degToRad(45);
    // cube.rotation.x = Math.PI / 180 * 45;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    // control도 update를 호출 해줘야 한다.
    controls.update();
  }

  render();
  window.addEventListener("resize", handleResize);

  const gui = new GUI();
  const options = {
    color: "0x00ffff",
  };
  // gui.add(cube.position, "y", -3, 3, 0.1);
  gui.add(cube.position, "y").min(-3).max(3).step(0.1); // chainning 형식
  gui.add(cube, "visible");
  gui.addColor(options, "color").onChange((v) => {
    cube.material.color.set(v);
  });
}

window.addEventListener("load", () => {
  init();
});
