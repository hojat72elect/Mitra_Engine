export function getMaxShaderComplexity(gl: WebGL2RenderingContext, numIfs: number): number {
    const assembleTestShader = (numIfs: number) => {
        const testShader = `#version 300 es
    precision mediump float;
    out vec4 fragColor;
    void main() {
      float index = 1.01;
      %%complexity%%
    }`;
        let testComplexity = '';
        for (let i = 0; i < numIfs; i++) {
            if (i === 0) {
                testComplexity += `if (index <= ${i}.5) {\n`;
            } else {
                testComplexity += `   else if (index <= ${i}.5) {\n`;
            }

            testComplexity += `      fragColor = vec4(1.0);\n`;
            testComplexity += `   }\n`;
        }
        return testShader.replace('%%complexity%%', testComplexity);
    };

    let canCompile = false;
    do {
        const test = assembleTestShader(numIfs);

        const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(shader, test);
        gl.compileShader(shader);

        canCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!canCompile) {
            numIfs = (numIfs / 2) | 0;
        }
    } while (!canCompile);
    return numIfs;
}
