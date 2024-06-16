import { RootState, useFrame, useThree } from '@react-three/fiber';
import { Box3, Color, Mesh, Vector3 } from 'three';
import { useEffect, useState } from 'react';

// Name for all Body meshes to distinguish them from other objects
const BODY_NAME = 'GRAVITATIONAL_BODY';

interface PointMass {
  position: Vector3;
  velocity: Vector3;
  readonly mass: number;
  readonly uuid: string;
}

function initializePointMass(mesh: Mesh): PointMass {
  console.log(mesh);
  mesh.geometry.computeBoundingSphere();
  return {
    position: mesh.position,
    velocity: new Vector3(0, 0, 0),
    mass: mesh.geometry.boundingSphere.radius ** 3,
    uuid: mesh.uuid,
  };
}

function computeForce(
  mass1: PointMass,
  mass2: PointMass,
  gravitationalConstant: number,
) {
  const squareDistance = mass1.position.distanceToSquared(mass2.position);
  const force = (
    gravitationalConstant * mass1.mass * mass2.mass / squareDistance
  );
  // Subtract mass1 from mass2 so the force vector points from 1 to 2
  return mass2.position.clone().sub(mass1.position).multiplyScalar(force);
}

function accelerate(
  allMasses: PointMass[],
  mass: PointMass,
  timeStep: number,
  gravitationalConstant: number,
) {
  const netForce = allMasses.reduce((force, otherMass) => {
    if (mass.uuid === otherMass.uuid) {
      // Don't compute force to self
      return force;
    }
    const forceToOther = computeForce(mass, otherMass, gravitationalConstant);
    return force.add(forceToOther);
  }, new Vector3(0.0, 0.0, 0.0));

  mass.velocity.add(netForce.multiplyScalar(timeStep / mass.mass));
}

function move(
  mass: PointMass,
  timeStep: number,
  bounds: Box3,
  wallElasticity: number,
) {
  if (mass.position.x < bounds.min.x || mass.position.x > bounds.max.x) {
    mass.velocity.x = -mass.velocity.x * wallElasticity;
  }
  if (mass.position.y < bounds.min.y || mass.position.y > bounds.max.y) {
    mass.velocity.y = -mass.velocity.y * wallElasticity;
  }
  if (mass.position.z < bounds.min.z || mass.position.z > bounds.max.z) {
    mass.velocity.z = -mass.velocity.z * wallElasticity;
  }
  bounds.clampPoint(mass.position, mass.position);
  mass.position.add(mass.velocity.clone().multiplyScalar(timeStep));
}

function animate(
  allMasses: PointMass[],
  timeStep: number,
  gravitationalConstant: number,
  wallElasticity: number,
  bounds: Box3,
) {
  allMasses.forEach((mass) => {
    accelerate(allMasses, mass, timeStep, gravitationalConstant);
    move(mass, timeStep, bounds, wallElasticity);
    // console.log(mass);
  });
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

interface BodyParams {
  allMasses: Map<string, PointMass>;
  initialPosition: Vector3;
  bodyRadius: number;
  gravitationalConstant: number
  wallElasticity: number
  color: Color | undefined;
}

function Body({
  initialPosition,
  bodyRadius,
  color,
} : BodyParams) {
  if (!color) {
    color = new Color(randomInt(0, 2**24));
  }
  return (
    <mesh
      position={initialPosition}
      name={BODY_NAME}
    >
      <circleGeometry args={[bodyRadius]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

interface GravitationalSystemParams {
  initialPositions: Vector3[];
  bodyRadius: number;
  gravitationalConstant: number;
  wallElasticity: number;
}

function GravitationalSystem({
  initialPositions,
  bodyRadius = 10.0,
  gravitationalConstant = 1.0,
  wallElasticity = 0.5,
} : GravitationalSystemParams) {
  const [allMasses, setMasses] = useState<PointMass[]>([]);
  const objectsInScene = useThree((state) => state.scene).children;

  useEffect(() => {
    if (allMasses.length === initialPositions.length) {
      return;
    }
    const newMasses = objectsInScene
      .filter(mesh => mesh.name === BODY_NAME)
      .filter(mesh => !Number.isNaN(mesh.position.x))
      .map(initializePointMass);
    setMasses(newMasses);
  }, [allMasses, initialPositions, objectsInScene]);

  useFrame((state: RootState, timeStep: number) => {
    const halfWidth = state.viewport.width / 2.0;
    const halfHeight = state.viewport.height / 2.0;
    const bounds = new Box3(
      new Vector3(-halfWidth, -halfHeight, -1),
      new Vector3( halfWidth,  halfHeight,  1),
    );
    animate(
      allMasses,
      timeStep,
      gravitationalConstant,
      wallElasticity,
      bounds,
    );
  });

  return (
    <>
      {initialPositions.map((pos, index) => (
        <Body
          key={index}
          initialPosition={pos}
          bodyRadius={bodyRadius}
        />
      ))}
    </>
  );
}

export default GravitationalSystem;
