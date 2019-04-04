/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef TROOPSDATAS_H
#define TROOPSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS TroopsDatas
//
//  Contains all the possible troops of a game. The data file is located in
//  Content/Datas/troops.json.
//
// -------------------------------------------------------

class TroopsDatas : public Serializable
{
public:
    TroopsDatas();
    virtual ~TroopsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault(QStandardItem *modelMonsters);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // TROOPSDATAS_H
