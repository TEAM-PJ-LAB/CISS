import type { Algorithm } from '../types';
import sorting from './sorting';
import searching from './searching';
import structures from './structures';
import graph from './graph';
import strings from './strings';
import compression from './compression';
import cryptography from './cryptography';
import ml from './ml';
import numerical from './numerical';
import geometry from './geometry';
import graphics from './graphics';
import systems from './systems';

export const ALGORITHMS: Algorithm[] = [
  ...sorting, ...searching, ...structures, ...graph, ...strings, ...compression,
  ...cryptography, ...ml, ...numerical, ...geometry, ...graphics, ...systems,
];
