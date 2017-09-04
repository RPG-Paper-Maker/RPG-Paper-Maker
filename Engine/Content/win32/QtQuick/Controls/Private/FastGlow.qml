/****************************************************************************
**
** Copyright (C) 2016 The Qt Company Ltd.
** Contact: https://www.qt.io/licensing/
**
** This file is part of the Qt Quick Controls module of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:LGPL$
** Commercial License Usage
** Licensees holding valid commercial Qt licenses may use this file in
** accordance with the commercial license agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and The Qt Company. For licensing terms
** and conditions see https://www.qt.io/terms-conditions. For further
** information use the contact form at https://www.qt.io/contact-us.
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 3 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL3 included in the
** packaging of this file. Please review the following information to
** ensure the GNU Lesser General Public License version 3 requirements
** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 2.0 or (at your option) the GNU General
** Public license version 3 or any later version approved by the KDE Free
** Qt Foundation. The licenses are as published by the Free Software
** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
** included in the packaging of this file. Please review the following
** information to ensure the GNU General Public License requirements will
** be met: https://www.gnu.org/licenses/gpl-2.0.html and
** https://www.gnu.org/licenses/gpl-3.0.html.
**
** $QT_END_LICENSE$
**
****************************************************************************/

import QtQuick 2.4

Item {
    id: rootItem
    property variant source
    property real spread: 0.0
    property real blur: 0.0
    property color color: "white"
    property bool transparentBorder: false
    property bool cached: false

    SourceProxy {
        id: sourceProxy
        input: rootItem.source
    }

    ShaderEffectSource {
        id: cacheItem
        anchors.fill: shaderItem
        visible: rootItem.cached
        smooth: true
        sourceItem: shaderItem
        live: true
        hideSource: visible
    }

    property string __internalBlurVertexShader: OpenGLInfo.profile === OpenGLInfo.CoreProfile ? "#version 150
        in vec4 qt_Vertex;
        in vec2 qt_MultiTexCoord0;
        uniform mat4 qt_Matrix;
        uniform float yStep;
        uniform float xStep;
        out vec2 qt_TexCoord0;
        out vec2 qt_TexCoord1;
        out vec2 qt_TexCoord2;
        out vec2 qt_TexCoord3;

        void main() {
            qt_TexCoord0 = vec2(qt_MultiTexCoord0.x + xStep, qt_MultiTexCoord0.y + yStep * 0.36);
            qt_TexCoord1 = vec2(qt_MultiTexCoord0.x + xStep * 0.36, qt_MultiTexCoord0.y - yStep);
            qt_TexCoord2 = vec2(qt_MultiTexCoord0.x - xStep * 0.36, qt_MultiTexCoord0.y + yStep);
            qt_TexCoord3 = vec2(qt_MultiTexCoord0.x - xStep, qt_MultiTexCoord0.y - yStep * 0.36);
            gl_Position = qt_Matrix * qt_Vertex;
        }
    " : "
        attribute highp vec4 qt_Vertex;
        attribute highp vec2 qt_MultiTexCoord0;
        uniform highp mat4 qt_Matrix;
        uniform highp float yStep;
        uniform highp float xStep;
        varying highp vec2 qt_TexCoord0;
        varying highp vec2 qt_TexCoord1;
        varying highp vec2 qt_TexCoord2;
        varying highp vec2 qt_TexCoord3;

        void main() {
            qt_TexCoord0 = vec2(qt_MultiTexCoord0.x + xStep, qt_MultiTexCoord0.y + yStep * 0.36);
            qt_TexCoord1 = vec2(qt_MultiTexCoord0.x + xStep * 0.36, qt_MultiTexCoord0.y - yStep);
            qt_TexCoord2 = vec2(qt_MultiTexCoord0.x - xStep * 0.36, qt_MultiTexCoord0.y + yStep);
            qt_TexCoord3 = vec2(qt_MultiTexCoord0.x - xStep, qt_MultiTexCoord0.y - yStep * 0.36);
            gl_Position = qt_Matrix * qt_Vertex;
        }
    "
    property string __internalBlurFragmentShader: OpenGLInfo.profile === OpenGLInfo.CoreProfile ? "#version 150
        uniform sampler2D source;
        uniform float qt_Opacity;
        in vec2 qt_TexCoord0;
        in vec2 qt_TexCoord1;
        in vec2 qt_TexCoord2;
        in vec2 qt_TexCoord3;
        out vec4 fragColor;

        void main() {
            vec4 sourceColor = (texture(source, qt_TexCoord0) +
                texture(source, qt_TexCoord1) +
                texture(source, qt_TexCoord2) +
                texture(source, qt_TexCoord3)) * 0.25;
            fragColor = sourceColor * qt_Opacity;
        }
    " : "
        uniform lowp sampler2D source;
        uniform lowp float qt_Opacity;
        varying highp vec2 qt_TexCoord0;
        varying highp vec2 qt_TexCoord1;
        varying highp vec2 qt_TexCoord2;
        varying highp vec2 qt_TexCoord3;

        void main() {
            highp vec4 sourceColor = (texture2D(source, qt_TexCoord0) +
            texture2D(source, qt_TexCoord1) +
            texture2D(source, qt_TexCoord2) +
            texture2D(source, qt_TexCoord3)) * 0.25;
            gl_FragColor = sourceColor * qt_Opacity;
        }
    "

    ShaderEffect {
        id: level0
        property variant source: sourceProxy.output
        anchors.fill: parent
        visible: false
        smooth: true
    }

    ShaderEffectSource {
        id: level1
        width: Math.ceil(shaderItem.width / 32) * 32
        height: Math.ceil(shaderItem.height / 32) * 32
        sourceItem: level0
        hideSource: rootItem.visible
        sourceRect: transparentBorder ? Qt.rect(-64, -64, shaderItem.width, shaderItem.height) : Qt.rect(0,0,0,0)
        smooth: true
        visible: false
    }

    ShaderEffect {
        id: effect1
        property variant source: level1
        property real yStep: 1/height
        property real xStep: 1/width
        anchors.fill: level2
        visible: false
        smooth: true
        vertexShader: __internalBlurVertexShader
        fragmentShader: __internalBlurFragmentShader
    }

    ShaderEffectSource {
        id: level2
        width: level1.width / 2
        height: level1.height / 2
        sourceItem: effect1
        hideSource: rootItem.visible
        visible: false
        smooth: true
    }

    ShaderEffect {
        id: effect2
        property variant source: level2
        property real yStep: 1/height
        property real xStep: 1/width
        anchors.fill: level3
        visible: false
        smooth: true
        vertexShader: __internalBlurVertexShader
        fragmentShader: __internalBlurFragmentShader
    }

    ShaderEffectSource {
        id: level3
        width: level2.width / 2
        height: level2.height / 2
        sourceItem: effect2
        hideSource: rootItem.visible
        visible: false
        smooth: true
    }

    ShaderEffect {
        id: effect3
        property variant source: level3
        property real yStep: 1/height
        property real xStep: 1/width
        anchors.fill: level4
        visible: false
        smooth: true
        vertexShader: __internalBlurVertexShader
        fragmentShader: __internalBlurFragmentShader
    }

    ShaderEffectSource {
        id: level4
        width: level3.width / 2
        height: level3.height / 2
        sourceItem: effect3
        hideSource: rootItem.visible
        visible: false
        smooth: true
    }

    ShaderEffect {
        id: effect4
        property variant source: level4
        property real yStep: 1/height
        property real xStep: 1/width
        anchors.fill: level5
        visible: false
        smooth: true
        vertexShader: __internalBlurVertexShader
        fragmentShader: __internalBlurFragmentShader
    }

    ShaderEffectSource {
        id: level5
        width: level4.width / 2
        height: level4.height / 2
        sourceItem: effect4
        hideSource: rootItem.visible
        visible: false
        smooth: true
    }

    ShaderEffect {
        id: effect5
        property variant source: level5
        property real yStep: 1/height
        property real xStep: 1/width
        anchors.fill: level6
        visible: false
        smooth: true
        vertexShader: __internalBlurVertexShader
        fragmentShader: __internalBlurFragmentShader
    }

    ShaderEffectSource {
        id: level6
        width: level5.width / 2
        height: level5.height / 2
        sourceItem: effect5
        hideSource: rootItem.visible
        visible: false
        smooth: true
    }

    Item {
        id: dummysource
        width: 1
        height: 1
        visible: false
    }

    ShaderEffectSource {
        id: dummy
        width: 1
        height: 1
        sourceItem: dummysource
        visible: false
        smooth: false
        live: false
    }

    ShaderEffect {
        id: shaderItem
        x: transparentBorder ? -64 : 0
        y: transparentBorder ? -64 : 0
        width: transparentBorder ? parent.width + 128 : parent.width
        height: transparentBorder ? parent.height + 128 : parent.height

        property variant source1: level1
        property variant source2: level2
        property variant source3: level3
        property variant source4: level4
        property variant source5: level5
        property variant source6: level6
        property real lod: rootItem.blur

        property real weight1;
        property real weight2;
        property real weight3;
        property real weight4;
        property real weight5;
        property real weight6;

        property real spread: 1.0 - (rootItem.spread * 0.98)
        property alias color: rootItem.color

        function weight(v) {
            if (v <= 0.0)
                return 1
            if (v >= 0.5)
                return 0

            return 1.0 - v / 0.5
        }

        function calculateWeights() {

            var w1 = weight(Math.abs(lod - 0.100))
            var w2 = weight(Math.abs(lod - 0.300))
            var w3 = weight(Math.abs(lod - 0.500))
            var w4 = weight(Math.abs(lod - 0.700))
            var w5 = weight(Math.abs(lod - 0.900))
            var w6 = weight(Math.abs(lod - 1.100))

            var sum = w1 + w2 + w3 + w4 + w5 + w6;
            weight1 = w1 / sum;
            weight2 = w2 / sum;
            weight3 = w3 / sum;
            weight4 = w4 / sum;
            weight5 = w5 / sum;
            weight6 = w6 / sum;

            upateSources()
        }

        function upateSources() {
            var sources = new Array();
            var weights = new Array();

            if (weight1 > 0) {
                sources.push(level1)
                weights.push(weight1)
            }

            if (weight2 > 0) {
                sources.push(level2)
                weights.push(weight2)
            }

            if (weight3 > 0) {
                sources.push(level3)
                weights.push(weight3)
            }

            if (weight4 > 0) {
                sources.push(level4)
                weights.push(weight4)
            }

            if (weight5 > 0) {
                sources.push(level5)
                weights.push(weight5)
            }

            if (weight6 > 0) {
                sources.push(level6)
                weights.push(weight6)
            }

            for (var j = sources.length; j < 6; j++) {
                sources.push(dummy)
                weights.push(0.0)
            }

            source1 = sources[0]
            source2 = sources[1]
            source3 = sources[2]
            source4 = sources[3]
            source5 = sources[4]
            source6 = sources[5]

            weight1 = weights[0]
            weight2 = weights[1]
            weight3 = weights[2]
            weight4 = weights[3]
            weight5 = weights[4]
            weight6 = weights[5]
        }

        Component.onCompleted: calculateWeights()

        onLodChanged: calculateWeights()

        fragmentShader: rootItem.OpenGLInfo.profile === OpenGLInfo.CoreProfile ? "#version 150
            uniform sampler2D source1;
            uniform sampler2D source2;
            uniform sampler2D source3;
            uniform sampler2D source4;
            uniform sampler2D source5;
            uniform float weight1;
            uniform float weight2;
            uniform float weight3;
            uniform float weight4;
            uniform float weight5;
            uniform vec4 color;
            uniform float spread;
            uniform float qt_Opacity;
            in vec2 qt_TexCoord0;
            out vec4 fragColor;

            float linearstep(float e0, float e1, float x) {
                return clamp((x - e0) / (e1 - e0), 0.0, 1.0);
            }

            void main() {
                vec4 sourceColor = texture(source1, qt_TexCoord0) * weight1;
                sourceColor += texture(source2, qt_TexCoord0) * weight2;
                sourceColor += texture(source3, qt_TexCoord0) * weight3;
                sourceColor += texture(source4, qt_TexCoord0) * weight4;
                sourceColor += texture(source5, qt_TexCoord0) * weight5;
                sourceColor = mix(vec4(0), color, linearstep(0.0, spread, sourceColor.a));
                fragColor = sourceColor * qt_Opacity;
            }
        " : "
            uniform lowp sampler2D source1;
            uniform lowp sampler2D source2;
            uniform lowp sampler2D source3;
            uniform lowp sampler2D source4;
            uniform lowp sampler2D source5;
            uniform mediump float weight1;
            uniform mediump float weight2;
            uniform mediump float weight3;
            uniform mediump float weight4;
            uniform mediump float weight5;
            uniform highp vec4 color;
            uniform highp float spread;
            uniform lowp float qt_Opacity;
            varying mediump vec2 qt_TexCoord0;

            highp float linearstep(highp float e0, highp float e1, highp float x) {
                return clamp((x - e0) / (e1 - e0), 0.0, 1.0);
            }

            void main() {
                lowp vec4 sourceColor = texture2D(source1, qt_TexCoord0) * weight1;
                sourceColor += texture2D(source2, qt_TexCoord0) * weight2;
                sourceColor += texture2D(source3, qt_TexCoord0) * weight3;
                sourceColor += texture2D(source4, qt_TexCoord0) * weight4;
                sourceColor += texture2D(source5, qt_TexCoord0) * weight5;
                sourceColor = mix(vec4(0), color, linearstep(0.0, spread, sourceColor.a));
                gl_FragColor = sourceColor * qt_Opacity;
            }
        "
    }
}
