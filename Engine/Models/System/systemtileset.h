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

#ifndef SYSTEMTILESET_H
#define SYSTEMTILESET_H

#include <QMetaType>
#include "superlistitem.h"
#include "systemspritewall.h"

// -------------------------------------------------------
//
//  CLASS SystemTileset
//
//  A particulary tileset (datas).
//
// -------------------------------------------------------


class SystemTileset : public SuperListItem
{
public:
    SystemTileset();
    SystemTileset(int i, QString n, int pictureId);
    SystemTileset(int i, QString n, SystemPicture* picture);
    virtual ~SystemTileset();
    SystemPicture* picture() const;
    QStandardItemModel* modelAutotiles() const;
    QStandardItemModel* modelSpriteWalls() const;
    QStandardItemModel* model3DObjects() const;
    QStandardItemModel* modelReliefs() const;
    void setPicture(SystemPicture* picture);
    void setPictureFromId(int id);
    void initializeModels();
    void addSpecial(SystemSpecialElement* special, QStandardItemModel* model);
    void addSpriteWall(SystemSpriteWall* wall);
    void updatePicture();
    void updateModelAutotiles();
    void updateModelSpriteWalls();
    void updateModel3DObjects();
    void updateModelReliefs();
    static void updateModel(QStandardItemModel* model,
                            QStandardItemModel* completeModel);
    static void moveModel(QStandardItemModel* model,
                          QStandardItemModel* completeModel,
                          int index);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemTileset &super);

    virtual void read(const QJsonObject &json);
    static void readModel(const QJsonObject &json, QString key,
                          QStandardItemModel* model);
    virtual void write(QJsonObject &json) const;
    static void writeModel(QJsonObject &json, QString key,
                           QStandardItemModel* model);

protected:
    SystemPicture* m_picture;
    int m_pictureID;
    QStandardItemModel* m_modelAutotiles;
    QStandardItemModel* m_modelSpriteWalls;
    QStandardItemModel* m_model3DObjects;
    QStandardItemModel* m_modelReliefs;
};

Q_DECLARE_METATYPE(SystemTileset)

#endif // SYSTEMTILESET_H
