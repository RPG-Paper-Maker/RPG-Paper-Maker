/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef AUTOTILES_H
#define AUTOTILES_H

#include <QOpenGLFunctions>
#include "autotile.h"
#include "mapproperties.h"
#include "textureseveral.h"

class MapPortion;

// -------------------------------------------------------
//
//  CLASS Autotiles
//
//  Autotiles grouped that are having the same texture.
//
// -------------------------------------------------------

class Autotiles : public Serializable, protected QOpenGLFunctions
{
public:
    Autotiles();
    virtual ~Autotiles();
    static QHash<QString, int> initializeAutotileBorder();
    static QHash<QString, int> autotileBorder;
    static const int COUNT_LIST;
    static QString listA[];
    static QString listB[];
    static QString listC[];
    static QString listD[];

    bool isEmpty() const;
    void updateEmpty(bool previewSquare);
    void clearAutotilesGL();
    AutotileDatas* getAutotile(Position& p) const;
    void setAutotile(Position& p, AutotileDatas* autotile);
    AutotileDatas* removeAutotile(Position& p);
    bool addAutotile(Position& p, AutotileDatas* autotile,
                     QJsonObject &previousObj,
                     MapEditorSubSelectionKind& previousType,
                     QSet<MapPortion*>& update, QSet<MapPortion*>& save);
    bool deleteAutotile(Position& p, QJsonObject &previous,
                        MapEditorSubSelectionKind &previousType,
                        QSet<MapPortion*>& update, QSet<MapPortion*>& save);

    void removeAutotileOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance, Position
        &finalPosition, QRay3D &ray, Position &previousCoords);
    bool updateRaycastingAt(Position &position, AutotileDatas *autotile, int
        squareSize, float &finalDistance, Position &finalPosition, QRay3D& ray,
        Position &previousCoords);
    void getAutotilesWithPreview(
            QHash<Position, AutotileDatas*> &autotilesWithPreview,
            QHash<Position, MapElement *> &preview);
    static AutotileDatas* tileExisting(Position& position, Portion& portion,
                                      QHash<Position, AutotileDatas*> &preview);
    static AutotileDatas* tileOnWhatever(
            Position& position, Portion& portion, int id, QRect &rect,
            QHash<Position, AutotileDatas*> &preview);
    static bool tileOnLeft(Position& position, Portion& portion, int id,
                           QRect& rect,
                           QHash<Position, AutotileDatas*> &preview);
    static bool tileOnRight(Position& position, Portion& portion, int id,
                            QRect& rect,
                            QHash<Position, AutotileDatas*> &preview);
    static bool tileOnTop(Position& position, Portion& portion, int id,
                          QRect& rect,
                          QHash<Position, AutotileDatas*> &preview);
    static bool tileOnBottom(Position& position, Portion& portion, int id,
                             QRect& rect,
                             QHash<Position, AutotileDatas*> &preview);
    static bool tileOnTopLeft(Position& position, Portion& portion, int id,
                              QRect& rect,
                              QHash<Position, AutotileDatas*> &preview);
    static bool tileOnTopRight(Position& position, Portion& portion, int id,
                               QRect& rect,
                               QHash<Position, AutotileDatas*> &preview);
    static bool tileOnBottomLeft(Position& position, Portion& portion, int id,
                                 QRect& rect,
                                 QHash<Position, AutotileDatas*> &preview);
    static bool tileOnBottomRight(Position& position, Portion& portion, int id,
                                  QRect& rect,
                                  QHash<Position, AutotileDatas*> &preview);
    void updateAround(Position& position,
                      QHash<Position, AutotileDatas *> &autotiles,
                      QSet<MapPortion *> &update, QSet<MapPortion *> &save,
                      QSet<MapPortion*>* previousPreview);
    void updateWithoutPreview(Position& position, QSet<MapPortion *> &update,
                              QSet<MapPortion *> &save);
    void initializeVertices(QList<TextureSeveral *> &texturesAutotiles,
                            QHash<Position, MapElement*>& previewSquares,
                            int squareSize);
    void initializeGL(QOpenGLShaderProgram* program);
    void updateGL();
    void paintGL(QOpenGLShaderProgram *program, int textureID, bool isAnimated,
        int frame, int uniform);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, AutotileDatas*> m_all;
    QList<Autotile*> m_autotilesGL;
    bool m_isEmpty;
};

#endif // AUTOTILES_H
