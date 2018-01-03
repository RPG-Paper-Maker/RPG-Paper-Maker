/****************************************************************************
**
** Copyright (C) 2012 Digia Plc and/or its subsidiary(-ies).
** Contact: http://www.qt-project.org/legal
**
** This file is part of the Qt3D module of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:LGPL$
** Commercial License Usage
** Licensees holding valid commercial Qt licenses may use this file in
** accordance with the commercial license agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and Digia.  For licensing terms and
** conditions see http://qt.digia.com/licensing.  For further information
** use the contact form at http://qt.digia.com/contact-us.
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
** In addition, as a special exception, Digia gives you certain additional
** rights.  These rights are described in the Digia Qt LGPL Exception
** version 1.1, included in the file LGPL_EXCEPTION.txt in this package.
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 3.0 as published by the Free Software
** Foundation and appearing in the file LICENSE.GPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU General Public License version 3.0 requirements will be
** met: http://www.gnu.org/copyleft/gpl.html.
**
**
** $QT_END_LICENSE$
**
****************************************************************************/

#ifndef QRAY3D_H
#define QRAY3D_H

#include "smallqt3d_global.h"
#include <QtGui/qvector3d.h>
#include <QtGui/qmatrix4x4.h>

QT_BEGIN_NAMESPACE

class QRay3D
{
public:
    QRay3D();
    QRay3D(const QVector3D &origin, const QVector3D &direction);

    QVector3D origin() const;
    void setOrigin(const QVector3D & value);

    QVector3D direction() const;
    void setDirection(const QVector3D & value);

    bool contains(const QVector3D &point) const;
    bool contains(const QRay3D &ray) const;

    QVector3D point(float t) const;
    float projectedDistance(const QVector3D &point) const;

    QVector3D project(const QVector3D &vector) const;

    float distance(const QVector3D &point) const;

    void transform(const QMatrix4x4 &matrix);
    QRay3D transformed(const QMatrix4x4 &matrix) const;

    bool operator==(const QRay3D &other);
    bool operator!=(const QRay3D &other);

private:
    QVector3D m_origin;
    QVector3D m_direction;

};

inline QRay3D::QRay3D() : m_direction(1.0f, 0.0f, 0.0f) {}

inline QRay3D::QRay3D(const QVector3D &origin_, const QVector3D &direction_)
    : m_origin(origin_)
    , m_direction(direction_)
{
}

inline QVector3D QRay3D::origin() const
{
    return m_origin;
}

inline void QRay3D::setOrigin(const QVector3D &value)
{
    m_origin = value;
}

inline QVector3D QRay3D::direction() const
{
    return m_direction;
}

inline void QRay3D::setDirection(const QVector3D & value)
{
    m_direction = value;
}

inline QVector3D QRay3D::point(float t) const
{
    return m_origin + t * m_direction;
}

inline void QRay3D::transform(const QMatrix4x4 &matrix)
{
    m_origin = matrix * m_origin;
    m_direction = matrix.mapVector(m_direction);
}

inline QRay3D QRay3D::transformed(const QMatrix4x4 &matrix) const
{
    return QRay3D(matrix * m_origin, matrix.mapVector(m_direction));
}

inline bool QRay3D::operator==(const QRay3D &other)
{
    return m_origin == other.origin() && m_direction == other.direction();
}

inline bool QRay3D::operator!=(const QRay3D &other)
{
    return m_origin != other.origin() || m_direction != other.direction();
}

inline bool qFuzzyCompare(const QRay3D &ray1, const QRay3D &ray2)
{
    return qFuzzyCompare(ray1.origin(), ray2.origin()) &&
           qFuzzyCompare(ray1.direction(), ray2.direction());
}

#ifndef QT_NO_DEBUG_STREAM
QDebug operator<<(QDebug dbg, const QRay3D &ray);
#endif

#ifndef QT_NO_DATASTREAM
QDataStream &operator<<(QDataStream &stream, const QRay3D &ray);
QDataStream &operator>>(QDataStream &stream, QRay3D &ray);
#endif

QT_END_NAMESPACE

Q_DECLARE_METATYPE(QRay3D)

#endif
