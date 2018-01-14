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

#include "qplane3d.h"
#include <QtCore/qmath.h>
#include <QtCore/qnumeric.h>

QT_BEGIN_NAMESPACE

/*!
    \class QPlane3D
    \brief The QPlane3D class models the mathematics of planes in 3D space.
    \since 4.8
    \ingroup qt3d
    \ingroup qt3d::math

    A plane is defined by an origin() point lying on the plane, and a
    normal() vector, which is perpendicular to the surface of the plane.
    The normal() vector does not need to be normalized.  QPlane3D is an
    infinite surface, from which the normal() vector points out perpendicular
    from the origin() point.

    \sa QRay3D
*/

/*!
    \fn QPlane3D::QPlane3D()

    Constructs a default plane object.  The defining origin() of the plane
    is set to (0, 0, 0) and the normal() vector is to (1, 0, 0).
*/

/*!
    \fn QPlane3D::QPlane3D(const QVector3D &point, const QVector3D &normal)

    Constructs a new plane, where \a point lies on the plane, and \a normal
    is perpendicular to it.  The \a normal does not have to be normalized.
    If \a normal is zero, the behavior of the plane is undefined.
*/

/*!
    \fn QPlane3D::QPlane3D(const QVector3D &p, const QVector3D &q, const QVector3D &r)

    Constructs a new plane defined by the three points \a p, \a q, and \a r.
    The point \a p is used as the plane's origin() point, and a normal()
    is constructed from the cross-product of \a q - \a p and \a r - \a q.
*/

/*!
    \fn QVector3D QPlane3D::origin() const

    Returns this plane's defining origin point.  The default value is (0, 0, 0).

    \sa setOrigin(), normal()
*/

/*!
    \fn void QPlane3D::setOrigin(const QVector3D& value)

    Set this plane's defining origin point to \a value.

    \sa origin(), setNormal()
*/

/*!
    \fn QVector3D QPlane3D::normal() const

    Returns this plane's normal vector.  The default value is (1, 0, 0).

    \sa setNormal(), origin()
*/

/*!
    \fn void QPlane3D::setNormal(const QVector3D& value)

    Set this plane's normal vector to \a value.  The \a value does
    not have to be normalized.  If \a value is zero, the behavior
    of the plane is undefined.

    \sa normal(), setOrigin()
*/

/*!
    Returns true if \a point lies in this plane; false otherwise.
*/
bool QPlane3D::contains(const QVector3D &point) const
{
    return qFuzzyIsNull
        (float(QVector3D::dotProduct(m_normal, m_origin - point)));
}

/*!
    Returns true if all of the points on \a ray lie in this plane;
    false otherwise.
*/
bool QPlane3D::contains(const QRay3D &ray) const
{
    return qFuzzyIsNull
                (float(QVector3D::dotProduct(m_normal, ray.direction()))) &&
            contains(ray.origin());
}

/*!
    Returns true if an intersection of \a ray with this plane exists;
    false otherwise.

    \sa intersection()
*/
bool QPlane3D::intersects(const QRay3D &ray) const
{
    return !qFuzzyIsNull
        (float(QVector3D::dotProduct(m_normal, ray.direction())));
}

/*!
    Returns the t value at which \a ray intersects this plane, or
    not-a-number if there is no intersection.

    When the \a ray intersects this plane, the return value is a
    parametric value that can be passed to QRay3D::point() to determine
    the actual intersection point, as shown in the following example:

    \code
    float t = plane.intersection(ray);
    QVector3D pt;
    if (qIsNaN(t)) {
        qWarning("no intersection occurred");
    else
        pt = ray.point(t);
    \endcode

    If the return value is positive, then the QRay3D::origin() of
    \a ray begins below the plane and then extends through it.
    If the return value is negative, then the origin begins
    above the plane.

    There are two failure cases where no single intersection point exists:

    \list
    \li when the ray is parallel to the plane (but does not lie on it)
    \li the ray lies entirely in the plane (thus every point "intersects")
    \endlist

    This method does not distinguish between these two failure cases and
    simply returns not-a-number for both.

    \sa intersects()
*/
float QPlane3D::intersection(const QRay3D& ray) const
{
    float dotLineAndPlane = QVector3D::dotProduct(m_normal, ray.direction());
    if (qFuzzyIsNull(float(dotLineAndPlane))) {
        // degenerate case - ray & plane-normal vectors are at
        // 90 degrees to each other, so either plane and ray never meet
        // or the ray lies in the plane - return failure case.
        return qSNaN();
    }
    return QVector3D::dotProduct(m_origin - ray.origin(), m_normal) /
                dotLineAndPlane;
}

/*!
    Returns the distance from this plane to \a point.  The value will
    be positive if \a point is above the plane in the direction
    of normal(), and negative if \a point is below the plane.
*/
float QPlane3D::distance(const QVector3D &point) const
{
    return QVector3D::dotProduct(point - m_origin, m_normal) /
                m_normal.length();
}

/*!
    \fn void QPlane3D::transform(const QMatrix4x4 &matrix)

    Transforms this plane using \a matrix, replacing origin() and
    normal() with the transformed versions.

    \sa transformed()
*/

/*!
    \fn QPlane3D QPlane3D::transformed(const QMatrix4x4 &matrix) const

    Returns a new plane that is formed by transforming origin()
    and normal() using \a matrix.

    \sa transform()
*/

/*!
    \fn bool QPlane3D::operator==(const QPlane3D &other)

    Returns true if this plane is the same as \a other; false otherwise.

    \sa operator!=()
*/

/*!
    \fn bool QPlane3D::operator!=(const QPlane3D &other)

    Returns true if this plane is not the same as \a other; false otherwise.

    \sa operator==()
*/

/*!
    \fn bool qFuzzyCompare(const QPlane3D &plane1, const QPlane3D &plane2)
    \relates QPlane3D

    Returns true if \a plane1 and \a plane2 are almost equal; false otherwise.
*/

#ifndef QT_NO_DEBUG_STREAM

QDebug operator<<(QDebug dbg, const QPlane3D &plane)
{
    dbg.nospace() << "QPlane3D(origin("
        << plane.origin().x() << ", " << plane.origin().y() << ", "
        << plane.origin().z() << ") - normal("
        << plane.normal().x() << ", " << plane.normal().y() << ", "
        << plane.normal().z() << "))";
    return dbg.space();
}

#endif

#ifndef QT_NO_DATASTREAM

/*!
    \relates QPlane3D

    Writes the given \a plane to the given \a stream and returns a
    reference to the stream.
*/
QDataStream &operator<<(QDataStream &stream, const QPlane3D &plane)
{
    stream << plane.origin();
    stream << plane.normal();
    return stream;
}

/*!
    \relates QPlane3D

    Reads a 3D plane from the given \a stream into the given \a plane
    and returns a reference to the stream.
*/
QDataStream &operator>>(QDataStream &stream, QPlane3D &plane)
{
    QVector3D origin, normal;
    stream >> origin;
    stream >> normal;
    plane = QPlane3D(origin, normal);
    return stream;
}

#endif // QT_NO_DATASTREAM

QT_END_NAMESPACE
