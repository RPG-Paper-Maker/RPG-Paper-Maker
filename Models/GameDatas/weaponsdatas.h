/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
