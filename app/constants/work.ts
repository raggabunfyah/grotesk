import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: 'ADIM 1',
    title: 'IHTIYAC',
    subtitle: 'Öncelikle ihtiyaçalara göre eksikler belirlenir.',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: 'ADIM 2',
    title: 'HAZIRLIK',
    subtitle: 'İhtiyaca göre hazırlıklar başlar.',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2017',
    title: 'Headout',
    subtitle: 'Software Developer Intern',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: '2018',
    title: 'Cohesity',
    subtitle: 'Member of Technical Staff',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: '?',
    subtitle: '???',
    position: 'right',
  }
]