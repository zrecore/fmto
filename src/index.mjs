/**
 * FMTO - A WebGPU based Math Library. Includes WebGPU accelerated functions for
 * Linear Algebra, Calculus, and Differential Equations.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

// Core
import { core } from './core/index.mjs';

// CS (Computer Science)
import {
    breadthFirst,
    depthFirst
} from 'cs/search/index.mjs';

// Math
import {calculus} from './math/calculus/index.mjs';
import {linearAlgebra} from './math/linearAlgebra/index.mjs';
import {differentialEquations} from './math/differentialEquations/index.mjs';

export {
    core,

    breadthFirst,
    depthFirst,

    linearAlgebra,
    calculus,
    differentialEquations
};