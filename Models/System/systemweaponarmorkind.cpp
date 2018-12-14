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

#include "systemweaponarmorkind.h"
#include "dialogsystemweaponarmorkind.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemWeaponArmorKind::SystemWeaponArmorKind() :
    SystemWeaponArmorKind(1, new LangsTranslation, QList<bool>())
{

}

SystemWeaponArmorKind::SystemWeaponArmorKind(int i, LangsTranslation* names,
                                             QList<bool> equipment) :
    SystemLang(i,names),
    m_equipment(equipment)
{

}

SystemWeaponArmorKind::~SystemWeaponArmorKind(){

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* SystemWeaponArmorKind::getEquipmentModel() const{
    QStandardItemModel* model = new QStandardItemModel;
    QStandardItemModel* equipmentModel = RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->modelCommonEquipment();
    SystemLang* equipment;
    QStandardItem* item;

    for (int i = 0; i < equipmentModel->invisibleRootItem()->rowCount(); i++){
        equipment = (SystemLang*) equipmentModel->item(i)->data()
                .value<qintptr>();
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(equipment)));
        item->setCheckable(true);
        if (m_equipment.at(equipment->id() - 1))
            item->setCheckState(Qt::Checked);
        item->setText(equipment->toString());
        model->appendRow(item);
    }

    return model;
}

// -------------------------------------------------------

void SystemWeaponArmorKind::updateEquipment(){
    QStandardItemModel* model = RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->modelCommonEquipment();
    QList<bool> previousEquipment = m_equipment;
    SystemLang* equipment;
    int index;

    m_equipment.clear();
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++){
        equipment = (SystemLang*) model->item(i)->data().value<qintptr>();
        index = equipment->id() - 1;

        if (index < previousEquipment.size())
            m_equipment.append(previousEquipment.at(index));
        else
            m_equipment.append(false);
    }
}

// -------------------------------------------------------

void SystemWeaponArmorKind::updateByModel(QStandardItemModel *model) {
    for (int i = 0; i < model->rowCount(); i++) {
        m_equipment.replace(i, model->item(i)->checkState() == Qt::Checked);
    }
}

// -------------------------------------------------------

void SystemWeaponArmorKind::setDefault(){
    updateEquipment();
}

// -------------------------------------------------------

bool SystemWeaponArmorKind::openDialog(){
    SystemWeaponArmorKind weaponArmorKind;
    weaponArmorKind.setCopy(*this);
    DialogSystemWeaponArmorKind dialog(weaponArmorKind);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(weaponArmorKind);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemWeaponArmorKind::createCopy() const{
    SystemWeaponArmorKind* super = new SystemWeaponArmorKind;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemWeaponArmorKind::setCopy(const SystemWeaponArmorKind&
                                    weaponArmorKind)
{
    SystemLang::setCopy(weaponArmorKind);

    m_equipment = weaponArmorKind.m_equipment;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemWeaponArmorKind::read(const QJsonObject &json){
    SystemLang::read(json);
    QJsonArray jsonEquipment = json["equipment"].toArray();

    for (int i = 0; i < jsonEquipment.size(); i++)
        m_equipment.append(jsonEquipment.at(i).toBool());
}

// -------------------------------------------------------

void SystemWeaponArmorKind::write(QJsonObject &json) const{
    SystemLang::write(json);
    QJsonArray tab;

    for (int i = 0; i < m_equipment.size(); i++)
        tab.append(m_equipment.at(i));
    json["equipment"] = tab;
}
