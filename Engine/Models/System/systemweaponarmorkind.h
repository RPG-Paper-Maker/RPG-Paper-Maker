/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef SYSTEMWEAPONARMORKIND_H
#define SYSTEMWEAPONARMORKIND_H

#include <QStandardItemModel>
#include <QMetaType>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemWeaponArmorKind
//
//  A particulary weapon armor kind (system).
//
// -------------------------------------------------------

class SystemWeaponArmorKind : public SystemLang
{
public:
    SystemWeaponArmorKind();
    SystemWeaponArmorKind(int i, LangsTranslation *names,
                          QList<bool> equipment);
    virtual ~SystemWeaponArmorKind();
    QStandardItemModel* getEquipmentModel() const;
    void updateEquipment();
    void setDefault();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemWeaponArmorKind& weaponArmorKind);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QList<bool> m_equipment;
};

Q_DECLARE_METATYPE(SystemWeaponArmorKind)

#endif // SYSTEMWEAPONARMORKIND_H
