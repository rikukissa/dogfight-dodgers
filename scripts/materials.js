import {Material, ContactMaterial} from 'p2';

export const plane = new Material();
export const ground = new Material();

export const contactMaterials = [
  new ContactMaterial(ground, plane, {
    friction: 0.1,
    restitution: 0.2
  })
];
