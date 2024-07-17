/**
 * FMTO - A WebGPU based Math Library. Includes WebGPU accelerated functions for
 * Linear Algebra, Calculus, and Differential Equations.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

// CS (Computer Science)
import {
    breadthFirst,
    depthFirst
} from 'cs/search/index.js';

// Math
import {calculus} from './math/calculus/index.js';
import {linearAlgebra} from './math/linearAlgebra/index.js';
import {differentialEquations} from './math/differentialEquations/index.js';

export {
    breadthFirst,
    depthFirst,

    linearAlgebra,
    calculus,
    differentialEquations
};