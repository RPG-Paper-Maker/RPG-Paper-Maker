/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TILESETSDATAS_H
#define TILESETSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemtileset.h"

// -------------------------------------------------------
//
//  CLASS TilesetsDatas
//
//  Contains all tilesets datas. The data file is located in
//  Content/Datas/tilesets.json.
//
// -------------------------------------------------------

class TilesetsDatas : public Serializable
{
public:
    TilesetsDatas();
    virtual ~TilesetsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // TILESETSDATAS_H
