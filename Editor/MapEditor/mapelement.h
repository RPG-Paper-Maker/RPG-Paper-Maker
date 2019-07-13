/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAPELEMENT_H
#define MAPELEMENT_H

#include "mapeditorsubselectionkind.h"
#include "mapeditorselectionkind.h"
#include "serializable.h"
#include "orientationkind.h"
#include "cameraupdownkind.h"
#include "position.h"
#include <QVector3D>

// -------------------------------------------------------
//
//  CLASS MapElement
//
//  A square element in the map.
//
// -------------------------------------------------------

class MapElement : public Serializable
{
public:
    MapElement();
    virtual ~MapElement();
    bool operator==(const MapElement& other) const;
    bool operator!=(const MapElement& other) const;
    void setXOffset(int x);
    void setYOffset(int y);
    void setZOffset(int z);

    static QString jsonX;
    static QString jsonY;
    static QString jsonZ;

    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void getPosSizeCenter(QVector3D& pos, QVector3D& size,
                                  QVector3D& center, QVector3D &offset,
                                  int squareSize, Position &position, int width,
                                  int height, bool front);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_xOffset;
    int m_yOffset;
    int m_zOffset;
};

#endif // MAPELEMENT_H
