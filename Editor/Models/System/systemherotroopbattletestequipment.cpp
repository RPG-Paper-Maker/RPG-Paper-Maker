/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemherotroopbattletestequipment.h"
#include "dialogsystemherotroopbattletestequipment.h"
#include "systemweaponarmorkind.h"
#include "systemcommonskillitem.h"
#include "rpm.h"

const QString SystemHeroTroopBattleTestEquipment::JSON_KIND = "kind";
const QString SystemHeroTroopBattleTestEquipment::JSON_WEAPON_ARMOR_ID = "weaponArmorID";
const int SystemHeroTroopBattleTestEquipment::DEFAULT_KIND = 0;
const int SystemHeroTroopBattleTestEquipment::DEFAULT_WEAPON_ARMOR_ID = 1;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemHeroTroopBattleTestEquipment::SystemHeroTroopBattleTestEquipment(int id,
    QString name, int kind, int weaponArmorID) :
    SuperListItem(id, name),
    m_kind(kind),
    m_weaponArmorID(weaponArmorID),
    m_modelWeapons(new QStandardItemModel),
    m_modelArmors(new QStandardItemModel)
{
    this->updateModels();
}

SystemHeroTroopBattleTestEquipment::~SystemHeroTroopBattleTestEquipment()
{
    delete m_modelWeapons;
    delete m_modelArmors;
}

int SystemHeroTroopBattleTestEquipment::kind() const
{
    return m_kind;
}

void SystemHeroTroopBattleTestEquipment::setKind(int kind)
{
    m_kind = kind;
}

int SystemHeroTroopBattleTestEquipment::weaponArmorID() const
{
    return m_weaponArmorID;
}

void SystemHeroTroopBattleTestEquipment::setWeapondArmorID(int weaponArmorID)
{
    m_weaponArmorID = weaponArmorID;
}

QStandardItemModel * SystemHeroTroopBattleTestEquipment::modelWeapons() const
{
    return m_modelWeapons;
}

QStandardItemModel * SystemHeroTroopBattleTestEquipment::modelArmors() const
{
    return m_modelArmors;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemHeroTroopBattleTestEquipment::updateModel(QStandardItemModel
    *modelKind, QStandardItemModel *model, QStandardItemModel *modelWeaponArmor)
{
    modelWeaponArmor->clear();
    QVector<int> possibleKind;
    SystemWeaponArmorKind *kind;
    int i, l;
    for (i = 0, l = modelKind->invisibleRootItem()->rowCount(); i < l; i++)
    {
        kind = reinterpret_cast<SystemWeaponArmorKind *>(SuperListItem
            ::getItemModelAt(modelKind, i));
        if (kind->getEquipmenAt(p_id))
        {
            possibleKind.append(kind->id());
        }
    }
    SystemCommonSkillItem *sys;
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        sys = reinterpret_cast<SystemCommonSkillItem *>(SuperListItem
            ::getItemModelAt(model, i));
        if (possibleKind.contains(sys->type())) {
            modelWeaponArmor->appendRow(sys->getModelRow());
        }
    }
}

// -------------------------------------------------------

void SystemHeroTroopBattleTestEquipment::updateModels()
{
    this->updateModel(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelWeaponsKind(), RPM::get()->project()->gameDatas()->weaponsDatas()
        ->model(), m_modelWeapons);
    this->updateModel(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelArmorsKind(), RPM::get()->project()->gameDatas()->armorsDatas()
        ->model(), m_modelArmors);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemHeroTroopBattleTestEquipment::toString() const
{
    QString weaponArmor;
    switch (m_kind) {
    case 0:
        weaponArmor = RPM::translate(Translations::NONE);
        break;
    case 1:
        weaponArmor = SuperListItem::getById(RPM::get()->project()->gameDatas()
            ->weaponsDatas()->model()->invisibleRootItem(), m_weaponArmorID)->toString();
        break;
    case 2:
        weaponArmor = SuperListItem::getById(RPM::get()->project()->gameDatas()
            ->armorsDatas()->model()->invisibleRootItem(), m_weaponArmorID)->toString();
        break;
    }
    return SuperListItem::beginningText + RPM::SPACE + p_name + RPM::COLON + RPM
        ::SPACE + weaponArmor;
}

// -------------------------------------------------------

bool SystemHeroTroopBattleTestEquipment::openDialog()
{
    SystemHeroTroopBattleTestEquipment equipment;
    equipment.setCopy(*this);
    DialogSystemHeroTroopBattleTestEquipment dialog(equipment);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(equipment);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemHeroTroopBattleTestEquipment::createCopy() const
{
    SystemHeroTroopBattleTestEquipment *super = new SystemHeroTroopBattleTestEquipment;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemHeroTroopBattleTestEquipment::setCopy(const SuperListItem &super)
{
    const SystemHeroTroopBattleTestEquipment *equipment;
    SuperListItem::setCopy(super);
    equipment = reinterpret_cast<const SystemHeroTroopBattleTestEquipment *>(&super);
    p_id = equipment->p_id;
    m_kind = equipment->m_kind;
    m_weaponArmorID = equipment->m_weaponArmorID;
}

// -------------------------------------------------------

void SystemHeroTroopBattleTestEquipment::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_KIND))
    {
        m_kind = json[JSON_KIND].toInt();
    }
    if (json.contains(JSON_WEAPON_ARMOR_ID))
    {
        m_weaponArmorID = json[JSON_WEAPON_ARMOR_ID].toInt();
    }
}

// -------------------------------------------------------

void SystemHeroTroopBattleTestEquipment::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    if (m_kind != DEFAULT_KIND)
    {
        json[JSON_KIND] = m_kind;
    }
    if (m_weaponArmorID != DEFAULT_WEAPON_ARMOR_ID)
    {
        json[JSON_WEAPON_ARMOR_ID] = m_weaponArmorID;
    }
}
