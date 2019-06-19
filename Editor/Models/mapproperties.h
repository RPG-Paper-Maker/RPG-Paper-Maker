/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef MAPPROPERTIES_H
#define MAPPROPERTIES_H

#include <QHash>
#include "systemlang.h"
#include "systemtileset.h"
#include "position.h"
#include "qray3d.h"
#include "systemplaysong.h"
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
    SystemPlaySong * music() const;
    void setMusic(SystemPlaySong* song);
    SystemPlaySong * backgroundSound() const;
    PrimitiveValue * skyColorID() const;
    void setSkyColorID(PrimitiveValue *skyColorID);
    void setBackgroundSound(SystemPlaySong* song);
    void addOverflow(Position& p, Portion& portion, QHash<Portion, QSet<Position
        >*> &hash);
    void removeOverflow(Position& p, Portion& portion, QHash<Portion, QSet<
        Position>*> &hash);
    void addOverflowSprites(Position& p, Portion& portion);
    void removeOverflowSprites(Position& p, Portion& portion);
    void addOverflowObjects3D(Position& p, Portion& portion);
    void removeOverflowObjects3D(Position& p, Portion& portion);

    bool isInGrid(Position3D& position, int squareSize, int offset) const;
    void getPortionsNumber(int& lx, int& ld, int &lh, int& lz);
    virtual void setCopy(const MapProperties& super);
    void save(QString path, bool temp = false);
    void updateRaycastingOverflowSprites(Portion& portion, float &finalDistance,
                                         Position &finalPosition, QRay3D& ray,
                                         double cameraHAngle);
    void updateRaycastingOverflowObjects3D(Portion& portion, float
        &finalDistance, Position &finalPosition, QRay3D &ray);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_tilesetID;
    int m_length;
    int m_width;
    int m_height;
    int m_depth;
    SystemPlaySong* m_music;
    SystemPlaySong* m_backgroundSound;
    PrimitiveValue *m_skyColorID;
    bool m_isSkyColor;
    QHash<Portion, QSet<Position>*> m_outOverflowSprites;
    QHash<Portion, QSet<Position>*> m_outOverflowObjects3D;
};

#endif // MAPPROPERTIES_H
