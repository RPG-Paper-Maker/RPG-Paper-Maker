/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef MONSTERSDATAS_H
#define MONSTERSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS MonstersDatas
//
//  Contains all the possible monsters of a game. The data file is located in
//  Content/Datas/monsters.json.
//
// -------------------------------------------------------

class MonstersDatas : public Serializable
{
public:
    MonstersDatas();
    virtual ~MonstersDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault(QStandardItem *modelCurrencies, QStandardItem *modelItems,
                    QStandardItem *modelWeapons, QStandardItem *modelArmors);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // MONSTERSDATAS_H
