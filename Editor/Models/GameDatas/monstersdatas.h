/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
