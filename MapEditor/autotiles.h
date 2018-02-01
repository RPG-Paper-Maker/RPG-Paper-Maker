/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef AUTOTILES_H
#define AUTOTILES_H

#include <QOpenGLFunctions>
#include "autotile.h"
#include "mapproperties.h"
#include "textureautotile.h"

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
    void clearAutotilesGL();
    AutotileDatas* getAutotile(Position& p) const;
    void setAutotile(Position& p, AutotileDatas* autotile);
    AutotileDatas* removeAutotile(Position& p);
    bool addAutotile(Position& p, AutotileDatas* autotile,
                     QJsonObject &previousObj,
                     MapEditorSubSelectionKind& previousType);
    bool deleteAutotile(Position& p, QJsonObject &previous,
                        MapEditorSubSelectionKind &previousType);

    void removeAutotileOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance,
                                 Position &finalPosition, QRay3D &ray);
    bool updateRaycastingAt(Position &position, AutotileDatas *autotile,
                            int squareSize, float &finalDistance,
                            Position &finalPosition, QRay3D& ray);
    int getLastLayerAt(Position& position) const;
    void updateRemoveLayer(Position& position, QList<QJsonObject> &previous,
                           QList<MapEditorSubSelectionKind> &previousType,
                           QList<Position> &positions);
    void getAutotilesWithPreview(
            QHash<Position, AutotileDatas*> &autotilesWithPreview,
            QHash<Position, MapElement *> &preview);
    static AutotileDatas* tileOnWhatever(Position& position, Portion& portion,
                                      QHash<Position, AutotileDatas*> &preview);
    static bool tileOnLeft(Position& position, Portion& portion,
                           QHash<Position, AutotileDatas*> &preview);
    static bool tileOnRight(Position& position, Portion& portion,
                            QHash<Position, AutotileDatas*> &preview);
    static bool tileOnTop(Position& position, Portion& portion,
                          QHash<Position, AutotileDatas*> &preview);
    static bool tileOnBottom(Position& position, Portion& portion,
                             QHash<Position, AutotileDatas*> &preview);
    static bool tileOnTopLeft(Position& position, Portion& portion,
                              QHash<Position, AutotileDatas*> &preview);
    static bool tileOnTopRight(Position& position, Portion& portion,
                               QHash<Position, AutotileDatas*> &preview);
    static bool tileOnBottomLeft(Position& position, Portion& portion,
                                 QHash<Position, AutotileDatas*> &preview);
    static bool tileOnBottomRight(Position& position, Portion& portion,
                                  QHash<Position, AutotileDatas*> &preview);
    void updateAround(Position& position,
                      QHash<Position, AutotileDatas *> &preview);
    void initializeVertices(QList<TextureAutotile*> &texturesAutotiles,
                            QHash<Position, MapElement*>& previewSquares,
                            int squareSize);
    void initializeGL(QOpenGLShaderProgram* program);
    void updateGL();
    void paintGL(int textureID);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, AutotileDatas*> m_all;
    QList<Autotile*> m_autotilesGL;

    // OpenGL
    QOpenGLShaderProgram* m_program;
};

#endif // AUTOTILES_H
