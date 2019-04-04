/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // TILESETSDATAS_H
