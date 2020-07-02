/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    bool isWeapon();
    void setIsWeapon(bool iw);

    QStandardItemModel* getEquipmentModel() const;
    bool getEquipmenAt(int id) const;
    void updateEquipment();
    void updateByModel(QStandardItemModel *model);
    void setDefault();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QList<bool> m_equipment;
    bool m_isWeapon;
};

Q_DECLARE_METATYPE(SystemWeaponArmorKind)

#endif // SYSTEMWEAPONARMORKIND_H
