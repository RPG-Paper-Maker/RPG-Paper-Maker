/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMHEROTROOPBATTLETESTEQUIPMENT_H
#define SYSTEMHEROTROOPBATTLETESTEQUIPMENT_H

#include <QMetaType>
#include "superlistitem.h"

class SystemHeroTroopBattleTestEquipment : public SuperListItem
{
public:
    static const QString JSON_KIND;
    static const QString JSON_WEAPON_ARMOR_ID;
    static const int DEFAULT_KIND;
    static const int DEFAULT_WEAPON_ARMOR_ID;

    SystemHeroTroopBattleTestEquipment(int id = 1, QString name = "", int kind =
        DEFAULT_KIND, int weaponArmorID = DEFAULT_WEAPON_ARMOR_ID);
    virtual ~SystemHeroTroopBattleTestEquipment();
    int kind() const;
    void setKind(int kind);
    int weaponArmorID() const;
    void setWeapondArmorID(int weaponArmorID);
    QStandardItemModel * modelWeapons() const;
    QStandardItemModel * modelArmors() const;

    void updateModel(QStandardItemModel *modelKind, QStandardItemModel *model,
        QStandardItemModel *modelWeaponArmor);
    void updateModels();

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_kind;
    int m_weaponArmorID;
    QStandardItemModel *m_modelWeapons;
    QStandardItemModel *m_modelArmors;
};

Q_DECLARE_METATYPE(SystemHeroTroopBattleTestEquipment)

#endif // SYSTEMHEROTROOPBATTLETESTEQUIPMENT_H
