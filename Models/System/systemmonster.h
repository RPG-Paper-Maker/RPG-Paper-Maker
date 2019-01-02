/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef SYSTEMMONSTER_H
#define SYSTEMMONSTER_H

#include "systemhero.h"

// -------------------------------------------------------
//
//  CLASS SystemMonster
//
//  A particulary monster (datas).
//
// -------------------------------------------------------

class SystemMonster : public SystemHero
{
public:
    SystemMonster();
    SystemMonster(int i, LangsTranslation* names, int idClass, int idBattler,
        int idFaceset, int exp, QStandardItemModel *currencies,
        QStandardItemModel *loots, QStandardItemModel *actions);
    virtual ~SystemMonster();
    int exp() const;
    void setExp(int i);
    QStandardItemModel* modelCurrencies() const;
    QStandardItemModel* modelLoots() const;
    QStandardItemModel* modelActions() const;
    void setCopy(const SystemMonster& monster);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_exp;
    QStandardItemModel* m_modelCurrencies;
    QStandardItemModel* m_modelLoots;
    QStandardItemModel* m_modelActions;
};

Q_DECLARE_METATYPE(SystemMonster)

#endif // SYSTEMMONSTER_H
