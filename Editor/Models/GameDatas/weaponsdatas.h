/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WEAPONSDATAS_H
#define WEAPONSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"


// -------------------------------------------------------
//
//  CLASS WeaponsDatas
//
//  Contains all the possible weapons of a game. The data file is located in
//  Content/Datas/weapons.json.
//
// -------------------------------------------------------

class WeaponsDatas : public Serializable
{
public:
    WeaponsDatas();
    virtual ~WeaponsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // WEAPONSDATAS_H
