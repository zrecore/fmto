/**
 * FMTO - A WebGPU based Math Library. Includes WebGPU accelerated functions for
 * Linear Algebra, Calculus, and Differential Equations.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

// Core
import Core from './core/index.mjs'

// CS (Computer Science)
import {
    BreadthFirst,
    DepthFirst
} from './cs/search/index.mjs'

// Math
import {Calculus} from './math/calculus/index.mjs'
import {LinearAlgebra} from './math/linearAlgebra/index.mjs'
import {DifferentialEquations} from './math/differentialEquations/index.mjs'

export {
    Core,

    BreadthFirst,
    DepthFirst,

    LinearAlgebra,
    Calculus,
    DifferentialEquations
}