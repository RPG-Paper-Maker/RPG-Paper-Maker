/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCAMERAPROPERTIES_H
#define SYSTEMCAMERAPROPERTIES_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemCameraProperties
//
//  A particulary camera properties (datas).
//
// -------------------------------------------------------

class SystemCameraProperties : public SuperListItem
{
public:
    static const QString JSON_DISTANCE;
    static const QString JSON_HORIZONTAL_ANGLE;
    static const QString JSON_VERTICAL_ANGLE;
    static const QString JSON_TARGET_OFFSET_X;
    static const QString JSON_TARGET_OFFSET_Y;
    static const QString JSON_TARGET_OFFSET_Z;
    static const QString JSON_IS_SQUARE_TARGET_OFFSET_X;
    static const QString JSON_IS_SQUARE_TARGET_OFFSET_Y;
    static const QString JSON_IS_SQUARE_TARGET_OFFSET_Z;
    static const QString JSON_FIELD_OF_VIEW;
    static const QString JSON_NEAR;
    static const QString JSON_FAR;
    static const double DEFAULT_DISTANCE;
    static const double DEFAULT_HORIZONTAL_ANGLE;
    static const double DEFAULT_VERTICAL_ANGLE;
    static const int DEFAULT_TARGET_OFFSET_X;
    static const int DEFAULT_TARGET_OFFSET_Y;
    static const int DEFAULT_TARGET_OFFSET_Z;
    static const bool DEFAULT_IS_SQUARE_TARGET_OFFSET_X;
    static const bool DEFAULT_IS_SQUARE_TARGET_OFFSET_Y;
    static const bool DEFAULT_IS_SQUARE_TARGET_OFFSET_Z;
    static const double DEFAULT_FIELD_OF_VIEW;
    static const double DEFAULT_NEAR;
    static const double DEFAULT_FAR;

    SystemCameraProperties();
    SystemCameraProperties(int i, QString n, PrimitiveValue *d = new
        PrimitiveValue(DEFAULT_DISTANCE), PrimitiveValue *ha = new
        PrimitiveValue(DEFAULT_HORIZONTAL_ANGLE), PrimitiveValue *va = new
        PrimitiveValue(DEFAULT_VERTICAL_ANGLE), PrimitiveValue *tox = new
        PrimitiveValue(DEFAULT_TARGET_OFFSET_X), PrimitiveValue *toy = new
        PrimitiveValue(DEFAULT_TARGET_OFFSET_Y), PrimitiveValue *toz = new
        PrimitiveValue(DEFAULT_TARGET_OFFSET_Z), bool istox =
        DEFAULT_IS_SQUARE_TARGET_OFFSET_X, bool istoy =
        DEFAULT_IS_SQUARE_TARGET_OFFSET_Y, bool istoz =
        DEFAULT_IS_SQUARE_TARGET_OFFSET_Z, PrimitiveValue *fov = new
        PrimitiveValue(DEFAULT_FIELD_OF_VIEW), PrimitiveValue *ne = new
        PrimitiveValue(DEFAULT_NEAR), PrimitiveValue *f = new PrimitiveValue(
        DEFAULT_FAR));
    virtual ~SystemCameraProperties();

    PrimitiveValue * distance() const;
    PrimitiveValue * horizontalAngle() const;
    PrimitiveValue * verticalAngle() const;
    PrimitiveValue * targetOffsetX() const;
    PrimitiveValue * targetOffsetY() const;
    PrimitiveValue * targetOffsetZ() const;
    bool isSquareTargetOffsetX() const;
    void setIsSquareTargetOffsetX(bool istox);
    bool isSquareTargetOffsetY() const;
    void setIsSquareTargetOffsetY(bool istoy);
    bool isSquareTargetOffsetZ() const;
    void setIsSquareTargetOffsetZ(bool istoz);
    PrimitiveValue * fieldOfView() const;
    PrimitiveValue * nearCam() const;
    PrimitiveValue * farCam() const;

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_distance;
    PrimitiveValue *m_horizontalAngle;
    PrimitiveValue *m_verticalAngle;
    PrimitiveValue *m_targetOffsetX;
    PrimitiveValue *m_targetOffsetY;
    PrimitiveValue *m_targetOffsetZ;
    bool m_isSquareTargetOffsetX;
    bool m_isSquareTargetOffsetY;
    bool m_isSquareTargetOffsetZ;
    PrimitiveValue *m_fieldOfView;
    PrimitiveValue *m_near;
    PrimitiveValue *m_far;
};

Q_DECLARE_METATYPE(SystemCameraProperties)

#endif // SYSTEMCAMERAPROPERTIES_H
