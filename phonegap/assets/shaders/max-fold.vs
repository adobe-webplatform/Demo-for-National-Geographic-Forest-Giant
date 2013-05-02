/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
precision mediump float;
precision mediump int;
 
// Uniforms passed-in from CSS
 
uniform float perspective;
uniform vec3 translation;
uniform vec3 rotation; // Euler angles, in degrees.
uniform float scale;
 
uniform vec3 lightPosition;
 
uniform float anchorIndex;
 
uniform float a0;
uniform float a1;
uniform float a2;
uniform float a3;
uniform float a4;
uniform float a5;
uniform float a6;
uniform float a7;
uniform float a8;
uniform float a9;
uniform float a10;
uniform float a11;
uniform float a12;
uniform float a13;
uniform float a14;
uniform float a15;
uniform float a16;
uniform float a17;
uniform float a18;
uniform float a19;
 
// Constants
 
const int maxBones = 20; // aka maxTiles, maxMeshSize.
 
// Built-in attributes
 
attribute vec4 a_position;
 
// Built-in uniforms
 
uniform mat4 u_projectionMatrix;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
 
// Varyings
 
varying float v_lightIntensity;
 
// Natural constants
 
const float PI = 3.1415629;
 
// Helpers
 
float rad(float angle)
{
    return angle * PI / 180.0;
}
 
int round(float f)
{
 	float lower = floor(f);
  	float higher = ceil(f);
  	float middle = (lower + higher) / 2.0;
  	return f >= middle ? int(higher) : int(lower);
}
 
// Takes a [0.0, 1.0] position and maps it to a joint index in the range [0, numJoints - 1].
int positionToJointIndex(float position, int numJoints)
{
    return int(round(position * float(numJoints - 1)));
}
 
void initializeArrayWithUniforms(out float a[maxBones])
{
    a[0] = a0;
    a[1] = a1;
    a[2] = a2;
    a[3] = a3;
    a[4] = a4;
    a[5] = a5;
    a[6] = a6;
    a[7] = a7;
    a[8] = a8;
    a[9] = a9;
    a[10] = a10;
    a[11] = a11;
    a[12] = a12;
    a[13] = a13;
    a[14] = a14;
    a[15] = a15;
    a[16] = a16;
    a[17] = a17;
    a[18] = a18;
    a[19] = a19;
}
 
mat4 xRotationMatrix(float angle)
{
  	float radians = rad(angle);
  	float sinA = sin(radians);
  	float cosA = cos(radians);
 	return mat4(
      	1.0, 0.0, 0.0, 0.0,
      	0.0, cosA, -sinA, 0.0,
      	0.0, sinA, cosA, 0.0,
		0.0, 0.0, 0.0, 1.0                                  
    );
}
 
mat4 yRotationMatrix(float angle)
{
    float radians = rad(angle);
    float sinA = sin(radians);
    float cosA = cos(radians);
    return mat4(
        cosA, 0.0, -sinA, 0.0,
        0.0, 1.0, 0.0, 0.0,
        sinA, 0.0, cosA, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}
 
mat4 zRotationMatrix(float angle)
{
 	float radians = rad(angle);
  	float sinA = sin(radians);
  	float cosA = cos(radians);
  	return mat4(
        cosA, -sinA, 0.0, 0.0,
        sinA, cosA, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}
 
mat4 rotationMatrix(vec3 angles)
{
  	return xRotationMatrix(angles.x) * yRotationMatrix(angles.y) * zRotationMatrix(angles.z);
}
 
mat4 translationMatrix(vec3 translation)
{
 	return mat4(
      	1.0, 0.0, 0.0, 0.0,
      	0.0, 1.0, 0.0, 0.0,
      	0.0, 0.0, 1.0, 0.0,
      	vec4(translation, 1.0)
    );
}
 
mat4 perspectiveMatrix(float perspective)
{
	return mat4(
      	1.0, 0.0, 0.0, 0.0,
      	0.0, 1.0, 0.0, 0.0,
      	0.0, 0.0, 1.0, -1.0 / perspective,
      	0.0, 0.0, 0.0, 1.0   	
    );
}
 
mat4 scalingMatrix(vec3 scale)
{
 	return mat4(
      	scale.x, 0.0, 0.0, 0.0,
      	0.0, scale.y, 0.0, 0.0,
      	0.0, 0.0, scale.z, 0.0,
      	0.0, 0.0, 0.0, 1.0
    );  
}
 
// Main
 
void main()
{
  	// Adjust position to have a lower left origin.
    vec4 position = a_position;
    position.xy += 0.5;
 
  	// Collect the joint angle uniforms into an array.
    float jointAngles[maxBones];
    initializeArrayWithUniforms(jointAngles);
  
  	// Set up some constants.
  	float numBones = u_meshSize.x;
    float boneLength = 1.0 / numBones;
    const int maxJoints = maxBones + 1;  
    int numJoints = int(u_meshSize.x) + 1;
  
  	// Determine which joint we're operating on, and where our anchor joint is.
    int currentJointIndex = positionToJointIndex(position.x, numJoints);
    int anchorJointIndex = int(anchorIndex);
 
  	// Start the forward kinematics algorithm at the anchor point.
    float accumulatedAngle = 0.0;
    vec2 accumulatedJointPosition = vec2(float(anchorJointIndex) / numBones, 0.0);  
 
    if (currentJointIndex < anchorJointIndex) {
      	// If we're to the left of the anchor point, accumulate angles and position from right to left.
        for (int i = maxJoints - 1; i >= 0; i--) {
            if (i >= anchorJointIndex)
                continue;
            
            accumulatedAngle += jointAngles[i];
            accumulatedJointPosition.x -= boneLength * cos(rad(accumulatedAngle));
            accumulatedJointPosition.y -= boneLength * sin(rad(accumulatedAngle));
          
            if (i == currentJointIndex)
                break;
        }
    } else if (currentJointIndex > anchorJointIndex) {
      	// If we're to the right of the anchor point, accumulate angles and position from left to right.
        for (int i = 1; i < maxJoints; i++) {
            if (i <= anchorJointIndex)
                continue;
          
            accumulatedAngle += jointAngles[i - 1];
            accumulatedJointPosition.x += boneLength * cos(rad(accumulatedAngle));
            accumulatedJointPosition.y += boneLength * sin(rad(accumulatedAngle));
          
            if (i == currentJointIndex)
                break;
        }
    }
  
  	// Map the forward kinematics algorithm position to the desired axes.
    position.x = accumulatedJointPosition.x;
    position.z = -accumulatedJointPosition.y;
 
  	// Adjust position back to have a centered origin.
    position.xy -= 0.5;  
  
  	// Apply the desired transforms on the position.
  	mat4 objectRotationMatrix = rotationMatrix(rotation);
  	position = translationMatrix(translation)
      * objectRotationMatrix 
      * scalingMatrix(vec3(scale))
      * position;
 
  	// Apply perspective projection and z-scaling.
    gl_Position = u_projectionMatrix 
      * perspectiveMatrix(perspective) 
      * scalingMatrix(vec3(1.0, 1.0, u_textureSize.x))
      * position;
 
	// Lighting:
  
  	// Normal starts pointing out of the screen.
    vec4 normal = vec4(0.0, 0.0, 1.0, 1.0); 
  
	// Rotate normal according to the forward kinematics curve.
    normal = yRotationMatrix(accumulatedAngle) * normal;
    normal = vec4(normalize(normal.xyz), 1.0);
 
  	// Apply the desired transform to the normal.
  	normal = objectRotationMatrix * normal;  
  
  	// Determine the vector between the point and the light.
  	vec3 lightVector = normalize(lightPosition - position.xyz);
  
  	// Determine the light intensity.
  	float lightIntensity = dot(normal.xyz, lightVector);
  
    v_lightIntensity = lightIntensity;
}
