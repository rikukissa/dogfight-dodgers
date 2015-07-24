import {Material, ContactMaterial} from 'p2';

export const wood = new Material();
export const ground = new Material();

export const contactMaterials = [
  new ContactMaterial(ground, wood, {
    friction: 50,
    restitution: 0.1
  })
];
