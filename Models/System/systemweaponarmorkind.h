/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    bool getEquipmenAt(int id) const;

    void updateEquipment();
    void updateByModel(QStandardItemModel *model);
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
