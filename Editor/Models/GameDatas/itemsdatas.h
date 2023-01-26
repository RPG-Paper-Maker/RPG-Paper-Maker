/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
    void deleteModel(QStandardItem* item);
};

#endif // ITEMSDATAS_H
