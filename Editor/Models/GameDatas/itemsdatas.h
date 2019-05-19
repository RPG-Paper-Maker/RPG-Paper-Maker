/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef ITEMSDATAS_H
#define ITEMSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS ItemsDatas
//
//  Contains all the possible items of a game. The data file is located in
//  Content/Datas/items.json.
//
// -------------------------------------------------------

class ItemsDatas : public Serializable
{
public:
    ItemsDatas();
    virtual ~ItemsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
    void deleteModel(QStandardItem* item);
};

#endif // ITEMSDATAS_H
