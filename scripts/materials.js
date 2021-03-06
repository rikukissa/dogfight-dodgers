import {Material, ContactMaterial} from 'p2';

export const crate = new Material();
export const ground = new Material();

export const contactMaterials = [
  new ContactMaterial(ground, crate, {
    friction: 50,
    restitution: 0.1
  })
];
