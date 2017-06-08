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

#include "systemweaponarmorkind.h"
#include "dialogsystemweaponarmorkind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemWeaponArmorKind::SystemWeaponArmorKind() : SystemLang()
{
    m_equipment = new QStandardItemModel();
}

SystemWeaponArmorKind::SystemWeaponArmorKind(int i, LangsTranslation* names,
                                             QStandardItemModel* equipment) :
    SystemLang(i,names),
    m_equipment(equipment)
{

}

SystemWeaponArmorKind::~SystemWeaponArmorKind(){
    delete m_equipment;
}

QStandardItemModel* SystemWeaponArmorKind::equipment() const {
    return m_equipment;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
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

void SystemWeaponArmorKind::setCopy(const SystemWeaponArmorKind&
                                    weaponArmorKind)
{
    SystemLang::setCopy(weaponArmorKind);

    QStandardItem* item;
    SuperListItem* equipment;
    for (int j = 0; j < weaponArmorKind.equipment()->invisibleRootItem()
         ->rowCount(); j++){
        equipment = SuperListItem::getById(weaponArmorKind.equipment()
                                           ->invisibleRootItem(), j+1);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(equipment)));
        item->setCheckable(true);
        if (weaponArmorKind.equipment()->item(j)->checkState() == Qt::Checked)
            item->setCheckState(Qt::Checked);
        item->setText(equipment->toString());
        m_equipment->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemWeaponArmorKind::read(const QJsonObject &json){
    SystemLang::read(json);
}

// -------------------------------------------------------

void SystemWeaponArmorKind::readEquipments(QStandardItemModel* model,
                                           const QJsonObject &json)
{
    QJsonArray jsonEquipment = json["equipment"].toArray();

    QStandardItem* item;
    SuperListItem* equipment;
    bool checked;

    for (int j = 0; j < jsonEquipment.size(); j++){
        checked = jsonEquipment[j].toBool();
        equipment = SuperListItem::getById(model->invisibleRootItem(), j+1);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(equipment)));
        item->setCheckable(true);
        if (checked) item->setCheckState(Qt::Checked);
        item->setText(equipment->toString());
        m_equipment->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemWeaponArmorKind::write(QJsonObject &json) const{
    SystemLang::write(json);
    QJsonArray tab;
    for (int i = 0; i < m_equipment->invisibleRootItem()->rowCount(); i++){
        tab.append(m_equipment->item(i)->checkState() == Qt::Checked);
    }
    json["equipment"] = tab;
}
