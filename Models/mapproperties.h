/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef MAPPROPERTIES_H
#define MAPPROPERTIES_H

#include <QHash>
#include "systemlang.h"
#include "systemtileset.h"
#include "position.h"
#include "qray3d.h"
#include "eventcommand.h"
#include "panelprimitivevalue.h"

// -------------------------------------------------------
//
//  CLASS MapProperties
//
//  All the properties of the map.
//
// -------------------------------------------------------

class MapProperties : public SystemLang
{
public:
    MapProperties();
    MapProperties(QString path);
    MapProperties(int i, LangsTranslation *names, int l, int w, int h, int d,
                  int idTileset);
    virtual ~MapProperties();
    QString realName() const;
    int length() const;
    int width() const;
    int height() const;
    int depth() const;
    SystemTileset* tileset() const;
    void setTilesetID(int id);
    void setLength(int l);
    void setWidth(int w);
    void setHeight(int h);
    void setDepth(int d);
    EventCommand * music() const;
    void setMusic(EventCommand* command);
    EventCommand * backgroundSound() const;
    PrimitiveValue * skyColorID() const;
    void setSkyColorID(PrimitiveValue *skyColorID);
    void setBackgroundSound(EventCommand* command);
    void addOverflow(Position& p, Portion& portion);
    void removeOverflow(Position& p, Portion& portion);

    bool isInGrid(Position3D& position, int squareSize, int offset) const;
    void getPortionsNumber(int& lx, int& ly, int& lz);
    virtual void setCopy(const MapProperties& super);
    void save(QString path, bool temp = false);
    void updateRaycastingOverflowSprites(Portion& portion, float &finalDistance,
                                         Position &finalPosition, QRay3D& ray,
                                         double cameraHAngle);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_tilesetID;
    int m_length;
    int m_width;
    int m_height;
    int m_depth;
    EventCommand* m_music;
    EventCommand* m_backgroundSound;
    PrimitiveValue *m_skyColorID;
    bool m_isSkyColor;
    QHash<Portion, QSet<Position>*> m_outOverflowSprites;
};

#endif // MAPPROPERTIES_H
