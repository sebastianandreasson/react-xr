import React, { useEffect, useRef, useState } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import {
  DefaultXRControllers,
  ARCanvas,
  Interactive,
  useHitTest,
  useXREvent,
  Hands,
} from '@react-three/xr'
import { Box } from '@react-three/drei'

import { useFrame } from '@react-three/fiber'
import { useAtom } from 'jotai'
import { objectsAtom } from './state'

const CustomBox = () => {
  const ref = useRef()

  const [color, setColor] = useState('blue')

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  useFrame(() => {
    ref.current.rotation.x += 0.001
    ref.current.rotation.y += 0.001
  })

  return (
    <Interactive onSelect={onSelect}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        position={[0, 0.1, -0.2]}
        scale={0.1}
      >
        <boxBufferGeometry />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>
    </Interactive>
  )
}

const CustomObject = ({ position, rotation, color }) => {
  return (
    <mesh position={position} rotation={rotation} scale={[0.1, 0.1, 0.1]}>
      <boxBufferGeometry />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  )
}

const CustomObjects = () => {
  const [objects] = useAtom(objectsAtom)

  return (
    <>
      {objects.map((obj, i) => (
        <CustomObject {...obj} key={`Object_${i}`} />
      ))}
    </>
  )
}

const ObjectPlacer = () => {
  const ref = useRef()
  const [, setObjects] = useAtom(objectsAtom)

  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  useXREvent('select', (e) => {
    setObjects((objs) => [
      ...objs,
      {
        position: ref.current.position,
        rotation: ref.current.rotation,
        scale: ref.current.scale,
        color: (Math.random() * 0xffffff) | 0,
      },
    ])
  })

  return <Box ref={ref} args={[0.1, 0.1, 0.1]} />
}

const App = () => {
  return (
    <ARCanvas sessionInit={{ optionalFeatures: ['hit-test'] }}>
      <ambientLight intensity={1} />
      <DefaultXRControllers />
      <Hands />
      <CustomBox />
      <ObjectPlacer />
      <CustomObjects />
    </ARCanvas>
  )
}

export default App
