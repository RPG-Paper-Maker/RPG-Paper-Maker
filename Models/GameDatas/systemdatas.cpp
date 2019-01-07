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

#include <QDir>
#include "systemdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemcurrency.h"
#include "systemcolor.h"
#include "systemwindowskin.h"

const QString SystemDatas::JSON_COLORS = "colors";
const QString SystemDatas::JSON_WINDOW_SKINS = "wskins";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemDatas::SystemDatas() :
    m_idMapHero(1),
    m_idObjectHero(1),
    m_showBB(false),
    m_modelColors(new QStandardItemModel),
    m_modelCurrencies(new QStandardItemModel),
    m_modelItemsTypes(new QStandardItemModel),
    m_modelWindowSkins(new QStandardItemModel)
{

}

SystemDatas::~SystemDatas() {
    SuperListItem::deleteModel(m_modelColors);
    SuperListItem::deleteModel(m_modelCurrencies);
    SuperListItem::deleteModel(m_modelItemsTypes);
    SuperListItem::deleteModel(m_modelWindowSkins);
}

void SystemDatas::read(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::pathSystem), *this);
}

int SystemDatas::portionsRay() const { return m_portionsRay; }

void SystemDatas::setPortionRay(int p) { m_portionsRay = p; }

int SystemDatas::squareSize() const { return m_squareSize; }

void SystemDatas::setSquareSize(int i) { m_squareSize = i; }

void SystemDatas::setIdMapHero(int i) { m_idMapHero = i; }

void SystemDatas::setIdObjectHero(int i) { m_idObjectHero = i; }

QString SystemDatas::pathBR() const { return m_pathBR; }

void SystemDatas::setPathBR(QString p) { m_pathBR = p; }

int SystemDatas::framesAnimation() const { return m_framesAnimation; }

void SystemDatas::setFramesAnimation(int f) { m_framesAnimation = f; }

bool SystemDatas::showBB() const { return m_showBB; }

void SystemDatas::setShowBB(bool b) { m_showBB = b; }

QStandardItemModel * SystemDatas::modelColors() const {
    return m_modelColors;
}

QStandardItemModel * SystemDatas::modelCurrencies() const {
    return m_modelCurrencies;
}

QStandardItemModel * SystemDatas::modelItemsTypes() const {
    return m_modelItemsTypes;
}

QStandardItemModel * SystemDatas::modelWindowSkins() const {
    return m_modelWindowSkins;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemDatas::setDefault() {
    m_portionsRay = 6;
    m_squareSize = 16;
    m_framesAnimation = 4;
    m_pathBR = Common::pathCombine(QDir::currentPath(), RPM::pathBR);

    setDefaultColors();
    setDefaultCurrencies();
    setDefaultItemsTypes();
    setDefaultWindowSkins();
}

// -------------------------------------------------------

void SystemDatas::setDefaultColors() {
    QStandardItem *item;
    SystemColor *color;
    QString namesColors[] = {"Black", "White", "BlueSky"};
    int r[] = {0, 255, 199};
    int g[] = {0, 255, 224};
    int b[] = {0, 255, 221};
    int length = (sizeof(namesColors)/sizeof(*namesColors));

    for (int i = 0; i < length; i++) {
        item = new QStandardItem;
        color = new SystemColor(i + 1, namesColors[i], r[i], g[i], b[i], 255);
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(color)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(color->toString());
        m_modelColors->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::setDefaultCurrencies() {
    QStandardItem *item;
    SystemCurrency *currency;
    QString namesCurrencies[] = {"G"};
    int length = (sizeof(namesCurrencies)/sizeof(*namesCurrencies));
    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        currency = new SystemCurrency(i+1,
                                      new LangsTranslation(namesCurrencies[i]));
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(currency)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(currency->toString());
        m_modelCurrencies->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::setDefaultItemsTypes() {
    QStandardItem *item;
    SuperListItem *sys;
    QString namesItemsKind[] = {"ingredient", "key items"};
    int length = (sizeof(namesItemsKind)/sizeof(*namesItemsKind));
    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        sys = new SuperListItem(i+1, namesItemsKind[i]);
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelItemsTypes->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::setDefaultWindowSkins() {
    QStandardItem *item = new QStandardItem;
    SystemWindowSkin *sys = new SystemWindowSkin(1, "Default");
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelWindowSkins->appendRow(item);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemDatas::read(const QJsonObject &json){
    QJsonArray jsonList;
    QStandardItem *item;

    // Clear
    SuperListItem::deleteModel(m_modelColors, false);
    SuperListItem::deleteModel(m_modelCurrencies, false);
    SuperListItem::deleteModel(m_modelItemsTypes, false);
    SuperListItem::deleteModel(m_modelWindowSkins, false);

    // Other options
    m_portionsRay = json["pr"].toInt();
    m_squareSize = json["ss"].toInt();
    m_idMapHero = json["idMapHero"].toInt();
    m_idObjectHero = json["idObjHero"].toInt();
    m_pathBR = json["pathBR"].toString();
    m_framesAnimation = json["frames"].toInt();
    m_showBB = json.contains("bb");

    // Colors
    jsonList = json[JSON_COLORS].toArray();
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        SystemColor *sys = new SystemColor;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelColors->appendRow(item);
    }

    // Currencies
    jsonList = json["currencies"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemCurrency* sys = new SystemCurrency;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelCurrencies->appendRow(item);
    }

    // Items kind
    jsonList = json["itemsTypes"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SuperListItem* sys = new SuperListItem;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelItemsTypes->appendRow(item);
    }

    // Window skins
    jsonList = json[JSON_WINDOW_SKINS].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem *item = new QStandardItem;
        SystemWindowSkin *sys = new SystemWindowSkin;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelWindowSkins->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    int l;

    // Other options
    json["pr"] = m_portionsRay;
    json["ss"] = m_squareSize;
    json["idMapHero"] = m_idMapHero;
    json["idObjHero"] = m_idObjectHero;
    json["pathBR"] = m_pathBR;
    json["frames"] = m_framesAnimation;
    if (m_showBB)
        json["bb"] = m_showBB;

    // Colors
    jsonArray = QJsonArray();
    l = m_modelColors->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemColor *sys = reinterpret_cast<SystemColor *>(m_modelColors
            ->item(i)->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_COLORS] = jsonArray;

    // Currencies
    jsonArray = QJsonArray();
    l = m_modelCurrencies->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemCurrency* sys = ((SystemCurrency*)m_modelCurrencies->item(i)
                               ->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["currencies"] = jsonArray;

    // Items kind
    jsonArray = QJsonArray();
    l = m_modelItemsTypes->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SuperListItem* sys = ((SuperListItem*)m_modelItemsTypes->item(i)
                              ->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["itemsTypes"] = jsonArray;

    // Window skins
    jsonArray = QJsonArray();
    l = m_modelWindowSkins->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemWindowSkin *sys = reinterpret_cast<SystemWindowSkin *>(
            m_modelWindowSkins->item(i)->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_WINDOW_SKINS] = jsonArray;
}
