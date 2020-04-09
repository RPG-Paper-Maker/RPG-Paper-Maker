/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
#include "mapelement.h"

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
    static const QString JSON_TILESET_ID;
    static const QString JSON_LENGTH;
    static const QString JSON_WIDTH;
    static const QString JSON_HEIGHT;
    static const QString JSON_DEPTH;
    static const QString JSON_MUSIC;
    static const QString JSON_BACKGROUND_SOUND;
    static const QString JSON_CAMERA_PROPERTIES;
    static const QString JSON_IS_SKY_COLOR;
    static const QString JSON_SKY_COLOR_ID;
    static const QString JSON_IS_SKY_IMAGE;
    static const QString JSON_SKY_PICTURE_ID;
    static const QString JSON_SKY_BOX_ID;
    static const QString JSON_STARTUP_OBJECT;
    static const QString JSON_OVERFLOW_SPRITES;
    static const QString JSON_OVERFLOW_OBJECTS3D;
    static const QString JSON_OVERFLOW_MOUNTAINS;

    MapProperties();
    MapProperties(QString path);
    MapProperties(int i, LangsTranslation *names, int l, int w, int h, int d,
        int idTileset);
    virtual ~MapProperties();

    SystemTileset * tileset() const;
    void setTilesetID(int id);
    int length() const;
    void setLength(int l);
    int width() const;
    void setWidth(int w);
    int height() const;
    void setHeight(int h);
    int depth() const;
    void setDepth(int d);
    SystemPlaySong * music() const;
    void setMusic(SystemPlaySong *song);
    SystemPlaySong * backgroundSound() const;
    void setBackgroundSound(SystemPlaySong *song);
    PrimitiveValue * cameraProperties() const;
    bool isSkyColor() const;
    void setIsSkyColor(bool isc);
    PrimitiveValue * skyColorID() const;
    void setSkyColorID(PrimitiveValue *skyColorID);
    bool isSkyImage() const;
    void setIsSkyImage(bool isi);
    SuperListItem * skyPictureID() const;
    PrimitiveValue * skyboxID() const;
    SystemCommonObject * startupObject() const;

    QString realName() const;
    void clearOverflowSprites();
    void clearOverflowObjects3D();
    void clearOverflowMountains();
    void addOverflow(Position &p, Portion &portion, QHash<Portion, QSet<Position
        > *> &hash);
    void removeOverflow(Position &p, Portion &portion, QHash<Portion, QSet<
        Position> *> &hash);
    void addOverflowSprites(Position &p, Portion &portion);
    void removeOverflowSprites(Position &p, Portion &portion);
    void addOverflowObjects3D(Position &p, Portion &portion);
    void removeOverflowObjects3D(Position &p, Portion &portion);
    void addOverflowMountains(Position &p, Portion &portion);
    void removeOverflowMountains(Position &p, Portion &portion);
    bool isInGrid(Position3D &position, int squareSize, int offset) const;
    void getPortionsNumber(int &lx, int &ld, int &lh, int &lz);
    void save(QString path, bool temp = false);
    void setDefaultStartupObject();
    void adjustPosition(QVector3D *position);
    MapElement * updateRaycastingOverflowSprites(Portion &portion, float
        &finalDistance, Position &finalPosition, QRay3D &ray, double
        cameraHAngle);
    MapElement * updateRaycastingOverflowObjects3D(Portion &portion, float
        &finalDistance, Position &finalPosition, QRay3D &ray);
    MapElement * updateRaycastingOverflowMountains(Portion &portion, float
        &finalDistance, Position &finalPosition, QRay3D &ray);
    void readOverflow(const QJsonArray &tab, QHash<Portion, QSet<Position> *>
        &overflow);
    void writeOverflow(QJsonObject &json, const QHash<Portion, QSet<Position> *>
        &overflow, QString jsonLabel) const;

    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_tilesetID;
    int m_length;
    int m_width;
    int m_height;
    int m_depth;
    SystemPlaySong *m_music;
    SystemPlaySong *m_backgroundSound;
    PrimitiveValue *m_cameraProperties;
    bool m_isSkyColor;
    PrimitiveValue *m_skyColorID;
    bool m_isSkyImage;
    SuperListItem *m_skyPictureID;
    PrimitiveValue *m_skyboxID;
    SystemCommonObject *m_startupObject;
    QHash<Portion, QSet<Position> *> m_outOverflowSprites;
    QHash<Portion, QSet<Position> *> m_outOverflowObjects3D;
    QHash<Portion, QSet<Position> *> m_outOverflowMountains;
};

#endif // MAPPROPERTIES_H
