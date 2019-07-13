/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMTILESET_H
#define SYSTEMTILESET_H

#include <QMetaType>
#include "systempicture.h"
#include "collisionsquare.h"

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
    SystemTileset(int i, QString n, int pictureID);
    virtual ~SystemTileset();
    SystemPicture* picture() const;
    QStandardItemModel* model(PictureKind kind) const;
    QStandardItemModel* modelAutotiles() const;
    QStandardItemModel* modelSpriteWalls() const;
    QStandardItemModel* model3DObjects() const;
    QStandardItemModel* modelMountains() const;
    void setPictureID(int id);
    void initializeModels();
    void addSpecial(SuperListItem *special, PictureKind kind);
    void updateModelAutotiles();
    void updateModelSpriteWalls();
    void updateModel3DObjects();
    void updateModelMountains();
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
    int m_pictureID;
    QStandardItemModel* m_modelAutotiles;
    QStandardItemModel* m_modelSpriteWalls;
    QStandardItemModel* m_model3DObjects;
    QStandardItemModel* m_modelMountains;
};

Q_DECLARE_METATYPE(SystemTileset)

#endif // SYSTEMTILESET_H
